// Provides database lookups and persistence for attendee accounts.
package com.community360.eventcreation;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendeeRepository extends JpaRepository<Attendee, String> {
    Optional<Attendee> findByEmail(String email);
    boolean existsByEmail(String email);
}
