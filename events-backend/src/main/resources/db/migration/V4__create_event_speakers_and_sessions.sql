
-- ==========================================
-- EVENTRIX: Event Speakers and Sessions
-- Migration: V4
-- ==========================================

-- Speakers associated with events.

CREATE TABLE event_speakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_id UUID NOT NULL,

    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    organization VARCHAR(255),
    bio TEXT,
    profile_url TEXT,

    photo_media_id UUID,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_speakers_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_event_speakers_photo
        FOREIGN KEY (photo_media_id)
        REFERENCES media_files(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_event_speakers_display_order
        CHECK (display_order >= 0),

    CONSTRAINT uq_event_speaker_id_event
        UNIQUE (id, event_id)
);

-- Sessions belonging to events.

CREATE TABLE event_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_id UUID NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    venue VARCHAR(255),

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_sessions_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_event_sessions_dates
        CHECK (end_date >= start_date),

    CONSTRAINT chk_event_sessions_times
        CHECK (
            end_date > start_date
            OR end_time > start_time
        ),

    CONSTRAINT chk_event_sessions_display_order
        CHECK (display_order >= 0),

    CONSTRAINT uq_event_session_id_event
        UNIQUE (id, event_id)
);

-- Lookup indexes.

CREATE INDEX idx_event_speakers_event
    ON event_speakers(event_id);

CREATE INDEX idx_event_speakers_photo
    ON event_speakers(photo_media_id);

CREATE INDEX idx_event_sessions_event
    ON event_sessions(event_id);

CREATE INDEX idx_event_sessions_schedule
    ON event_sessions(event_id, start_date, start_time);
