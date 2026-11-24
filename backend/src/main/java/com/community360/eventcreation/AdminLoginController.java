// Authenticates admins, verifies legacy email addresses and manages the admin session.
package com.community360.eventcreation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.http.CacheControl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(
        origins = "http://localhost:3001",
        allowCredentials = "true"
)
public class AdminLoginController {

    private final AdminRepository repository;
    private final EmailVerificationService verification;

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder(12);

    public AdminLoginController(AdminRepository repository, EmailVerificationService verification) {
        this.repository = repository;
        this.verification = verification;
    }

    public record LoginRequest(
            @NotBlank @Size(max = 254) String communityId,
            @NotBlank @Size(max = 72) String password,
            @Size(max = 6) String code
    ) {}

    @PostMapping(value = "/login", consumes = "application/json")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest login,
            HttpServletRequest request) {

        if (login.communityId() == null ||
                login.communityId().isBlank() ||
                login.password() == null ||
                login.password().isBlank() ||
                login.password().getBytes(StandardCharsets.UTF_8).length > 72) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Enter valid login details."));
        }

        String identifier = login.communityId().trim();

        Admin admin = repository.findById(identifier)
                .orElseGet(() -> repository
                        .findByEmail(identifier.toLowerCase(Locale.ROOT))
                        .orElse(null));

        if (admin == null ||
                !encoder.matches(login.password(), admin.getPasswordHash())) {

            return ResponseEntity.status(401)
                    .body(Map.of(
                            "error",
                            "Invalid Community 360 ID, email or password."
                    ));
        }

        if (!admin.isEmailVerified()) {
            if (login.code() == null || login.code().isBlank()) {
                verification.send("admin-login", admin.getEmail(), request.getRemoteAddr());
                return ResponseEntity.accepted().body(Map.of("verificationRequired", true, "email", admin.getEmail()));
            }
            verification.verify("admin-login", admin.getEmail(), login.code());
            admin.markEmailVerified();
            repository.saveAndFlush(admin);
        }
        HttpSession oldSession = request.getSession(false);

        if (oldSession != null) {
            oldSession.invalidate();
        }

        HttpSession session = request.getSession(true);

        session.setAttribute("communityId", admin.getCommunityId());
        session.setMaxInactiveInterval(1800);

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(Map.of(
                "communityId", admin.getCommunityId(),
                "fullName", admin.getFullName(),
                "organization", admin.getOrganization()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null ||
                session.getAttribute("communityId") == null) {

            return ResponseEntity.status(401)
                    .body(Map.of("error", "Please log in."));
        }

        String id = (String) session.getAttribute("communityId");

        Admin admin = repository.findById(id).orElse(null);

        if (admin == null || !admin.isEmailVerified()) {
            session.invalidate();

            return ResponseEntity.status(401)
                    .body(Map.of("error", "Please log in."));
        }

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(Map.of(
                "communityId", admin.getCommunityId(),
                "fullName", admin.getFullName(),
                "organization", admin.getOrganization(),
                "email", admin.getEmail()
        ));
    }

    @PostMapping(value = "/logout", consumes = "application/json")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("communityId") != null) session.invalidate();
        return ResponseEntity.noContent().build();
    }
}
