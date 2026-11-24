//This controller receives registration requests from your Next.js frontend.

package com.community360.eventcreation;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3001")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    public record RegisterRequest(
            @NotBlank @Size(max = 100) String fullName,
            @NotBlank @Size(max = 150) String organization,
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(min = 8, max = 72) String password
    ) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Password is too long."));
        }

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
