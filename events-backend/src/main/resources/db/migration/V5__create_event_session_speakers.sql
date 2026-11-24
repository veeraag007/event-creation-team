
-- ==========================================
-- EVENTRIX: Session-Speaker Mapping
-- Migration: V5
-- ==========================================

CREATE TABLE event_session_speakers (
    event_id UUID NOT NULL,
    session_id UUID NOT NULL,
    speaker_id UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_event_session_speakers
        PRIMARY KEY (session_id, speaker_id),

    -- Ensure the session belongs to the specified event.
    CONSTRAINT fk_session_speakers_session
        FOREIGN KEY (session_id, event_id)
        REFERENCES event_sessions(id, event_id)
        ON DELETE CASCADE,

    -- Ensure the speaker belongs to the same event.
    CONSTRAINT fk_session_speakers_speaker
        FOREIGN KEY (speaker_id, event_id)
        REFERENCES event_speakers(id, event_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_session_speakers_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
);

-- Lookup speakers assigned to an event.
CREATE INDEX idx_session_speakers_event
    ON event_session_speakers(event_id);

-- Lookup sessions assigned to a speaker.
CREATE INDEX idx_session_speakers_speaker
    ON event_session_speakers(speaker_id);