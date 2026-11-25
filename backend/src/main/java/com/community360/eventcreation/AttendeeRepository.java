// Provides database lookups and persistence for attendee accounts.
package com.community360.eventcreation;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendeeRepository extends JpaRepository<Attendee, String> {
    Optional<Attendee> findByEmail(String email);
    @Query(value = "select event_id from attendee_favorites where attendee_id = :id", nativeQuery = true)
    List<UUID> favorites(String id);

    @Query(value = "select event_id from attendee_favorites group by event_id order by count(*) desc, event_id", nativeQuery = true)
    List<UUID> rankedFavorites();

    @Transactional
    @Modifying
    @Query(value = "insert into attendee_favorites (attendee_id, event_id) values (:id, :event) on conflict do nothing", nativeQuery = true)
    void addFavorite(String id, UUID event);

    @Transactional
    @Modifying
    @Query(value = "delete from attendee_favorites where attendee_id = :id and event_id = :event", nativeQuery = true)
    void removeFavorite(String id, UUID event);

    boolean existsByEmail(String email);
}
