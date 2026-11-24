
// Exposes paginated published-event lists and details.
package com.eventrix.api.controller;

import com.eventrix.api.dto.ApiResponse;
import com.eventrix.api.dto.PagedApiResponse;
import com.eventrix.api.dto.PaginationMetadata;
import com.eventrix.api.entity.Event;
import com.eventrix.api.service.EventService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/published")
    public ResponseEntity<PagedApiResponse<Event>> getPublishedEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        if (page < 0 || size < 1 || size > 100) {
            return ResponseEntity.badRequest().build();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("startDate", "startTime", "id"));

        Page<Event> events = eventService.getPublishedEvents(pageable);

        PaginationMetadata pagination = new PaginationMetadata(
                events.getNumber(),
                events.getSize(),
                events.getTotalElements(),
                events.getTotalPages()
        );

        PagedApiResponse<Event> response = new PagedApiResponse<>(
                true,
                "Published events retrieved successfully",
                events.getContent(),
                pagination
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> getPublishedEventById(
            @PathVariable UUID id) {

        return eventService.getPublishedEventById(id)
                .map(event -> ResponseEntity.ok(
                        new ApiResponse<>(
                                true,
                                "Event retrieved successfully",
                                event
                        )
                ))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(
                                false,
                                "Published event not found",
                                null
                        )));
    }
}
