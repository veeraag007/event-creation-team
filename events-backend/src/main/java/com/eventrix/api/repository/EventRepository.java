
// Finds published event records using Spring Data JPA.
package com.eventrix.api.repository;

import com.eventrix.api.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    Page<Event> findByStatus(String status, Pageable pageable);

    @EntityGraph(attributePaths = {"tags"})
    Optional<Event> findByIdAndStatus(UUID id, String status);
}
