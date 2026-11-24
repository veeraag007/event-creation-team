
package com.community.eventapi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "events")
public class Event {

    @Id
@GeneratedValue(strategy = GenerationType.UUID)
private UUID id;

    private String title;
    private String description;
    private String category;
    private String venueMode;

private String venueName;

private String address;

private String city;

private String mapLink;

private String meetingLink;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String speaker;
    private String bannerUrl;

    private String status = "draft";

    public Event() {}

    public UUID getId() {
    return id;
}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    
public String getVenueMode() {
    return venueMode;
}

public void setVenueMode(String venueMode) {
    this.venueMode = venueMode;
}

public String getVenueName() {
    return venueName;
}

public void setVenueName(String venueName) {
    this.venueName = venueName;
}

public String getAddress() {
    return address;
}

public void setAddress(String address) {
    this.address = address;
}

public String getCity() {
    return city;
}

public void setCity(String city) {
    this.city = city;
}

public String getMapLink() {
    return mapLink;
}

public void setMapLink(String mapLink) {
    this.mapLink = mapLink;
}

public String getMeetingLink() {
    return meetingLink;
}

public void setMeetingLink(String meetingLink) {
    this.meetingLink = meetingLink;
}


    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime value) {
        this.startDateTime = value;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(LocalDateTime value) {
        this.endDateTime = value;
    }

    public String getSpeaker() {
        return speaker;
    }

    public void setSpeaker(String speaker) {
        this.speaker = speaker;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
