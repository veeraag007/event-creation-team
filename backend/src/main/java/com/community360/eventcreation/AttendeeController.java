// Handles attendee signup, login, profile updates, password changes and logout.
package com.community360.eventcreation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendee")
@CrossOrigin(origins = "http://localhost:3001", allowCredentials = "true")
public class AttendeeController {
    private final AttendeeRepository repository;
    private final EmailVerificationService verification;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public AttendeeController(AttendeeRepository repository, EmailVerificationService verification) {
        this.repository = repository;
        this.verification = verification;
    }

    public record Signup(@NotBlank @Size(max = 100) String fullName,
                         @NotBlank @Email @Size(max = 254) String email,
                         @NotBlank @Size(min = 8, max = 72) String password,
                         @Size(max = 6) String code) {}
    public record Login(@NotBlank @Email @Size(max = 254) String email,
                        @NotBlank @Size(max = 72) String password,
                        @Size(max = 6) String code) {}
    public record Profile(@NotBlank @Size(max = 100) String fullName,
                          @Size(max = 30) String phone, @Size(max = 100) String location,
                          @Size(max = 240) String address) {}
    public record PasswordChange(@NotBlank @Size(max = 72) String currentPassword,
                                 @NotBlank @Size(min = 8, max = 72) String newPassword) {}
    public record AttendeeProfile(String id, String fullName, String email, String phone, String location,
                                  String address, boolean notificationsEnabled) {}
    public record Preferences(@NotNull Boolean notificationsEnabled) {}

    private static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static boolean passwordFits(String password) {
        return password.getBytes(StandardCharsets.UTF_8).length <= 72;
    }

    private ResponseEntity<?> error(int status, String message) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore())
                .body(Map.of("error", message));
    }

    private ResponseEntity<AttendeeProfile> profile(Attendee attendee) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(
                new AttendeeProfile(attendee.getId(), attendee.getFullName(),
                        attendee.getEmail(), attendee.getPhone(), attendee.getLocation(), attendee.getAddress(),
                        attendee.notificationsEnabled()));
    }

    private Attendee current(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || !(session.getAttribute("attendeeId") instanceof String id)) {
            return null;
        }
        Attendee attendee = repository.findById(id).orElse(null);
        if (attendee == null || !attendee.isEmailVerified()) {
            session.invalidate();
            return null;
        }
        return attendee;
    }

    @PostMapping(value = "/register", consumes = "application/json")
    public ResponseEntity<?> register(@Valid @RequestBody Signup signup, HttpServletRequest request) {
        if (!passwordFits(signup.password())) return error(400, "Password is too long.");
        String email = normalize(signup.email());
        if (repository.existsByEmail(email)) return error(409, "Email already registered.");
        if (signup.code() == null || signup.code().isBlank()) {
            verification.send("attendee-signup", email, request.getRemoteAddr());
            return ResponseEntity.accepted().body(Map.of("verificationRequired", true, "email", email));
        }
        verification.verify("attendee-signup", email, signup.code());
        try {
            repository.saveAndFlush(new Attendee(UUID.randomUUID().toString(),
                    signup.fullName().trim(), email, encoder.encode(signup.password())));
            return ResponseEntity.status(201).body(Map.of("message", "Account created."));
        } catch (DataIntegrityViolationException failure) {
            return error(409, "Could not create an account with this email.");
        }
    }

    @PostMapping(value = "/login", consumes = "application/json")
    public ResponseEntity<?> login(@Valid @RequestBody Login login, HttpServletRequest request) {
        Attendee attendee = repository.findByEmail(normalize(login.email())).orElse(null);
        if (!passwordFits(login.password()) || attendee == null ||
                !encoder.matches(login.password(), attendee.getPasswordHash())) {
            return error(401, "Invalid email or password.");
        }
        if (!attendee.isEmailVerified()) {
            if (login.code() == null || login.code().isBlank()) {
                verification.send("attendee-login", attendee.getEmail(), request.getRemoteAddr());
                return ResponseEntity.accepted().body(Map.of("verificationRequired", true, "email", attendee.getEmail()));
            }
            verification.verify("attendee-login", attendee.getEmail(), login.code());
            attendee.markEmailVerified();
            repository.saveAndFlush(attendee);
        }
        HttpSession previous = request.getSession(false);
        if (previous != null) previous.invalidate();
        HttpSession session = request.getSession(true);
        session.setAttribute("attendeeId", attendee.getId());
        session.setMaxInactiveInterval(1800);
        return profile(attendee);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        Attendee attendee = current(request);
        return attendee == null ? error(401, "Sign in first.") : profile(attendee);
    }

    @Transactional
    @PutMapping(value = "/me", consumes = "application/json")
    public ResponseEntity<?> update(@Valid @RequestBody Profile details, HttpServletRequest request) {
        Attendee attendee = current(request);
        if (attendee == null) return error(401, "Sign in first.");
        attendee.updateProfile(details.fullName().trim(),
                details.phone() == null ? "" : details.phone().trim(), details.location(), details.address());
        return profile(repository.saveAndFlush(attendee));
    }

    @Transactional
    @PutMapping(value = "/preferences", consumes = "application/json")
    public ResponseEntity<?> preferences(@Valid @RequestBody Preferences preferences, HttpServletRequest request) {
        Attendee attendee = current(request);
        if (attendee == null) return error(401, "Sign in first.");
        attendee.setNotificationsEnabled(preferences.notificationsEnabled());
        return profile(repository.saveAndFlush(attendee));
    }

    @GetMapping("/wishlist")
    public ResponseEntity<?> wishlist(HttpServletRequest request) {
        Attendee attendee = current(request);
        if (attendee == null) return error(401, "Sign in first.");
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(repository.favorites(attendee.getId()));
    }

    @GetMapping("/top-events")
    public ResponseEntity<?> topEvents(HttpServletRequest request) {
        if (current(request) == null) return error(401, "Sign in first.");
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(repository.rankedFavorites());
    }

    @PutMapping(value = "/wishlist/{event}", consumes = "application/json")
    public ResponseEntity<?> favorite(@PathVariable UUID event, HttpServletRequest request) {
        Attendee attendee = current(request);
        if (attendee == null) return error(401, "Sign in first.");
        repository.addFavorite(attendee.getId(), event);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/wishlist/{event}")
    public ResponseEntity<?> unfavorite(@PathVariable UUID event, HttpServletRequest request) {
        Attendee attendee = current(request);
        if (attendee == null) return error(401, "Sign in first.");
        repository.removeFavorite(attendee.getId(), event);
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @PostMapping(value = "/password", consumes = "application/json")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChange change,
                                            HttpServletRequest request) {
        Attendee attendee = current(request);
        if (attendee == null) return error(401, "Sign in first.");
        if (!passwordFits(change.currentPassword()) || !passwordFits(change.newPassword())) {
            return error(400, "Password is too long.");
        }
        if (!encoder.matches(change.currentPassword(), attendee.getPasswordHash())) {
            return error(400, "Current password is incorrect.");
        }
        attendee.changePassword(encoder.encode(change.newPassword()));
        repository.saveAndFlush(attendee);
        request.getSession(false).invalidate();
        return ResponseEntity.ok(Map.of("message", "Password changed. Sign in again."));
    }

    @PostMapping(value = "/logout", consumes = "application/json")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("attendeeId") != null) session.invalidate();
        return ResponseEntity.noContent().build();
    }
}
