//This controller receives registration requests from your Next.js frontend.

package com.community360.eventcreation;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3001", allowCredentials = "true")
public class AdminController {

    private final AdminService service;
    private final AdminRepository repository;
    private final EmailVerificationService verification;

    public AdminController(AdminService service, AdminRepository repository, EmailVerificationService verification) {
        this.service = service;
        this.repository = repository;
        this.verification = verification;
    }

    public record RegisterRequest(
            @NotBlank @Size(max = 100) String fullName,
            @NotBlank @Size(max = 150) String organization,
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(min = 8, max = 72) String password,
            @Size(max = 6) String code
    ) {}

    @PostMapping(value = "/register", consumes = "application/json")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request, HttpServletRequest http) {

        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Password is too long."));
        }

        String email = EmailVerificationService.normalize(request.email());
        if (repository.existsByEmail(email)) return ResponseEntity.status(409)
                .body(Map.of("error", "This email is already registered."));
        if (request.code() == null || request.code().isBlank()) {
            verification.send("admin-signup", email, http.getRemoteAddr());
            return ResponseEntity.accepted().body(Map.of("verificationRequired", true, "email", email));
        }
        verification.verify("admin-signup", email, request.code());
        try {
            String id = service.register(
                    request.fullName(),
                    request.organization(),
                    request.email(),
                    request.password()
            );

            return ResponseEntity.status(201)
                    .body(Map.of("communityId", id));

        } catch (IllegalArgumentException | DataIntegrityViolationException e) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "This email is already registered."));
        }
    }
}
