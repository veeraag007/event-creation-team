
// Loads published events and their metadata within database transactions.
package com.eventrix.api.service;

import com.eventrix.api.entity.Event;
import com.eventrix.api.repository.EventRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class EventService {

    private static final String PUBLISHED_STATUS = "published";

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Page<Event> getPublishedEvents(Pageable pageable) {
        Page<Event> events = eventRepository.findByStatus(PUBLISHED_STATUS, pageable);
        // Initialize batched tags inside the transaction without paginating a collection join.
        events.forEach(event -> event.getTags().size());
        return events;
    }

    public Optional<Event> getPublishedEventById(UUID id) {
        return eventRepository.findByIdAndStatus(id, PUBLISHED_STATUS);
    }
}
