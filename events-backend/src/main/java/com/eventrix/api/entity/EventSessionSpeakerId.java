
// Defines the composite key for session-speaker links.
package com.eventrix.api.entity;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class EventSessionSpeakerId implements Serializable {

    private UUID sessionId;
    private UUID speakerId;

    public EventSessionSpeakerId() {
    }

    public EventSessionSpeakerId(UUID sessionId, UUID speakerId) {
        this.sessionId = sessionId;
        this.speakerId = speakerId;
    }

    public UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }

    public UUID getSpeakerId() {
        return speakerId;
    }

    public void setSpeakerId(UUID speakerId) {
        this.speakerId = speakerId;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }

        if (!(object instanceof EventSessionSpeakerId that)) {
            return false;
        }

        return Objects.equals(sessionId, that.sessionId)
                && Objects.equals(speakerId, that.speakerId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sessionId, speakerId);
    }
}
