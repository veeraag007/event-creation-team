
package com.community.eventapi.controller;
import com.community.eventapi.dto.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import com.community.eventapi.entity.Event;
import com.community.eventapi.repository.EventRepository;
import com.community.eventapi.ApiResponse;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3001")
public class EventController {

    private final EventRepository repository;

    public EventController(EventRepository repository) {
        this.repository = repository;
    }

    
@PostMapping
public ApiResponse<Event> createEvent(@RequestBody Event event) {

    // Validate venue mode
    if (event.getVenueMode() == null) {
        throw new IllegalArgumentException("Venue mode is required");
    }

    // In-person event validation
    if (event.getVenueMode().equalsIgnoreCase("in-person")) {

        if (isBlank(event.getVenueName()) ||
            isBlank(event.getAddress()) ||
            isBlank(event.getCity())) {

            throw new IllegalArgumentException(
                "Venue name, address and city are required for in-person events"
            );
        }

        event.setMeetingLink(null);
    }

    // Online event validation
    else if (event.getVenueMode().equalsIgnoreCase("online")) {

        if (isBlank(event.getMeetingLink())) {
            throw new IllegalArgumentException(
                "Meeting link is required for online events"
            );
        }

        event.setVenueName(null);
        event.setAddress(null);
        event.setCity(null);
        event.setMapLink(null);
    }

    else {
        throw new IllegalArgumentException(
            "Venue mode must be online or in-person"
        );
    }

    return new ApiResponse<>(
    true,
    "Event created successfully",
    repository.save(event)
);
}

private boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
}


   
@GetMapping
public ApiResponse<List<Event>> getAllEvents() {
    return new ApiResponse<>(
        true,
        "Events retrieved successfully",
        repository.findAll()
    );
}
@GetMapping("/published")
public ApiResponse<PageResponse<Event>> getPublishedEvents(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

    Page<Event> events = repository.findByStatus(
        "published",
        PageRequest.of(page, size)
    );

    PageResponse<Event> response = new PageResponse<>(
        events.getContent(),
        events.getNumber(),
        events.getSize(),
        events.getTotalElements(),
        events.getTotalPages()
    );

    return new ApiResponse<>(
        true,
        "Published events retrieved successfully",
        response
    );
}

@GetMapping("/{id}")
public ApiResponse<Event> getEvent(@PathVariable UUID id) {
    Event event = repository.findById(id).orElseThrow();

    return new ApiResponse<>(
        true,
        "Event retrieved successfully",
        event
    );
}

    @PutMapping("/{id}")
    public ApiResponse<Event> updateEvent(
            @PathVariable UUID id,
            @RequestBody Event updatedEvent) {

        Event event = repository.findById(id).orElseThrow();

        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setCategory(updatedEvent.getCategory());
        event.setVenueName(updatedEvent.getVenueName());
        event.setVenueMode(updatedEvent.getVenueMode());
event.setAddress(updatedEvent.getAddress());
event.setCity(updatedEvent.getCity());
event.setMapLink(updatedEvent.getMapLink());
event.setMeetingLink(updatedEvent.getMeetingLink());
        event.setStartDateTime(updatedEvent.getStartDateTime());
        event.setEndDateTime(updatedEvent.getEndDateTime());
        event.setSpeaker(updatedEvent.getSpeaker());
        event.setBannerUrl(updatedEvent.getBannerUrl());
        event.setStatus(updatedEvent.getStatus());

        return new ApiResponse<>(
    true,
    "Event updated successfully",
    repository.save(event)
);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable UUID id) {
        repository.deleteById(id);
    }
    @PatchMapping("/{id}/publish")
public ApiResponse<Event> publishEvent(@PathVariable UUID id) {

    Event event = repository.findById(id).orElseThrow();

    event.setStatus("published");

    return new ApiResponse<>(
        true,
        "Event published successfully",
        repository.save(event)
    );
}
@PatchMapping("/{id}/unpublish")
public ApiResponse<Event> unpublishEvent(@PathVariable UUID id) {

    Event event = repository.findById(id).orElseThrow();

    event.setStatus("unpublished");

    return new ApiResponse<>(
        true,
        "Event unpublished successfully",
        repository.save(event)
    );
}

@PatchMapping("/{id}/cancel")
public ApiResponse<Event> cancelEvent(@PathVariable UUID id) {

    Event event = repository.findById(id).orElseThrow();

    event.setStatus("cancelled");

    return new ApiResponse<>(
        true,
        "Event cancelled successfully",
        repository.save(event)
    );
}
}
