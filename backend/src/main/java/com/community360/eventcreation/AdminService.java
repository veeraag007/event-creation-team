//This service generates the Community 360 ID, checks duplicate emails, hashes the password, and saves the account in PostgreSQL.

package com.community360.eventcreation;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Locale;

@Service
public class AdminService {

    private final AdminRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public AdminService(AdminRepository repository) {
        this.repository = repository;
    }

    public String register(String fullName,
                           String organization,
                           String email,
                           String password) {

        email = email.trim().toLowerCase(Locale.ROOT);

        if (repository.existsByEmail(email)) {
            throw new IllegalArgumentException("This email is already registered.");
        }

        String abbreviation = organization
                .toUpperCase(Locale.ROOT)
                .replaceAll("[^A-Z0-9]", "");

        if (abbreviation.isEmpty()) {
            abbreviation = "ORG";
        }

        abbreviation = abbreviation.substring(
                0, Math.min(5, abbreviation.length())
        );

        long adminNumber = repository.getNextAdminNumber();

        String communityId = String.format(
                Locale.ROOT,
                "C360-%s-%04d",
                abbreviation,
                adminNumber
        );
        String passwordHash = encoder.encode(password);

        Admin admin = new Admin(
                communityId,
                fullName.trim(),
                organization.trim(),
                email,
                passwordHash
        );

        repository.saveAndFlush(admin);

        return communityId;
    }
}
