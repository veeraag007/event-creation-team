package com.community360.eventcreation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
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

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder(12);

    public AdminLoginController(AdminRepository repository) {
        this.repository = repository;
    }

    public record LoginRequest(
            String communityId,
            String password
    ) {}

    @PostMapping(value = "/login", consumes = "application/json")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest login,
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

        HttpSession oldSession = request.getSession(false);

        if (oldSession != null) {
            oldSession.invalidate();
        }

        HttpSession session = request.getSession(true);

        session.setAttribute("communityId", admin.getCommunityId());
        session.setMaxInactiveInterval(1800);

        return ResponseEntity.ok(Map.of(
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

        if (admin == null) {
            session.invalidate();

            return ResponseEntity.status(401)
                    .body(Map.of("error", "Please log in."));
        }

        return ResponseEntity.ok(Map.of(
                "communityId", admin.getCommunityId(),
                "fullName", admin.getFullName(),
                "organization", admin.getOrganization(),
                "email", admin.getEmail()
        ));
    }
}