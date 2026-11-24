
// Links an event to an uploaded media record.
package com.eventrix.api.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "event_media")
public class EventMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    @Column(name = "media_file_id", nullable = false)
    private UUID mediaFileId;

    @Column(name = "media_role", nullable = false, length = 20)
    private String mediaRole;

    @Column(name = "alt_text", length = 500)
    private String altText;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected EventMedia() {
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

    public UUID getMediaFileId() {
        return mediaFileId;
    }

    public void setMediaFileId(UUID mediaFileId) {
        this.mediaFileId = mediaFileId;
    }

    public String getMediaRole() {
        return mediaRole;
    }

    public void setMediaRole(String mediaRole) {
        this.mediaRole = mediaRole;
    }

    public String getAltText() {
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
