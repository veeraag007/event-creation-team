
package com.community.eventapi.repository;

import com.community.eventapi.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.UUID;

public interface EventRepository
        extends JpaRepository<Event, UUID> {

    List<Event> findByStatus(String status);
     Page<Event> findByStatus(String status, Pageable pageable);
}
