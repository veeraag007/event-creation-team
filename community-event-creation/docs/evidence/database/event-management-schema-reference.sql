-- EVENTRIX / CommUnity
-- Complete target PostgreSQL schema for the Admin Event Creation module.
-- PostgreSQL 16+
--
-- IMPORTANT:
-- This is a CONSOLIDATED SCHEMA for a fresh database.
-- It includes the existing events/event_tags structure plus the proposed
-- additions. It is NOT a migration to run directly against the existing
-- database, because V1 has already created events and event_tags there.
-- For the existing database, Member 1 must translate these additions into
-- new Flyway migrations (V2, V3, ...), preserving existing data.
--
-- Flyway manages flyway_schema_history automatically. Do not create it here.
--
-- Image storage:
-- Binary image files live in backend-managed filesystem/object storage.
-- PostgreSQL stores metadata and storage_key only, never image binary data
-- and never externally supplied image URLs for event artwork.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. EVENTS: one row per event
-- ---------------------------------------------------------------------------

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Publication workflow
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'unpublished', 'cancelled')),
    published_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Basic information
    title VARCHAR(255) NOT NULL,
    short_description VARCHAR(500),
    description TEXT,

    -- Classification
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    event_level VARCHAR(50),

    -- Organizer / contact information
    organizer_name VARCHAR(255),
    organizer_contact_name VARCHAR(255),
    organizer_email VARCHAR(255),
    organizer_phone VARCHAR(50),
    organizer_website TEXT,

    -- Event format
    event_type VARCHAR(20) NOT NULL
        CHECK (event_type IN ('ONLINE', 'OFFLINE', 'HYBRID')),

    -- Event schedule
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME WITHOUT TIME ZONE,
    end_time TIME WITHOUT TIME ZONE,
    timezone VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',

    -- Registration window (timestamps are interpreted in the event timezone
    -- by the application; use TIMESTAMPTZ instead if the team standardizes
    -- all API/database timestamps to absolute instants)
    registration_start TIMESTAMP WITHOUT TIME ZONE,
    registration_end TIMESTAMP WITHOUT TIME ZONE,

    -- Venue / location
    venue_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    location_url TEXT,
    online_meeting_url TEXT,

    -- Capacity
    capacity INTEGER CHECK (capacity IS NULL OR capacity >= 0),

    -- Registration and ticket settings
    registration_required BOOLEAN NOT NULL DEFAULT TRUE,
    ticket_type VARCHAR(10) NOT NULL DEFAULT 'FREE'
        CHECK (ticket_type IN ('FREE', 'PAID')),
    ticket_price NUMERIC(12, 2) NOT NULL DEFAULT 0
        CHECK (ticket_price >= 0),
    max_attendees INTEGER CHECK (max_attendees IS NULL OR max_attendees >= 0),
    registration_limit INTEGER CHECK (registration_limit IS NULL OR registration_limit >= 0),
    waitlist_enabled BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT chk_events_date_range
        CHECK (end_date >= start_date),

    CONSTRAINT chk_events_time_range
        CHECK (
            start_date <> end_date
            OR start_time IS NULL
            OR end_time IS NULL
            OR end_time > start_time
        ),

    CONSTRAINT chk_events_registration_range
        CHECK (
            registration_start IS NULL
            OR registration_end IS NULL
            OR registration_end >= registration_start
        )
);

-- ---------------------------------------------------------------------------
-- 2. EVENT_TAGS: multiple tags per event
-- ---------------------------------------------------------------------------

CREATE TABLE event_tags (
    event_id UUID NOT NULL,
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (event_id, tag),
    CONSTRAINT fk_event_tags_event
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- 3. MEDIA_FILES: metadata for uploaded image files
-- ---------------------------------------------------------------------------

CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL UNIQUE,
    storage_provider VARCHAR(30) NOT NULL DEFAULT 'LOCAL'
        CHECK (storage_provider IN ('LOCAL', 'S3', 'MINIO', 'OTHER')),
    storage_key TEXT NOT NULL UNIQUE,
    mime_type VARCHAR(50) NOT NULL
        CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
    file_size_bytes BIGINT NOT NULL
        CHECK (file_size_bytes > 0 AND file_size_bytes <= 5242880),
    checksum_sha256 VARCHAR(64),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- 4. EVENT_MEDIA: event artwork and gallery associations
-- ---------------------------------------------------------------------------

CREATE TABLE event_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    media_file_id UUID NOT NULL,
    media_role VARCHAR(20) NOT NULL
        CHECK (media_role IN ('BANNER', 'THUMBNAIL', 'LOGO', 'GALLERY')),
    alt_text VARCHAR(500),
    display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_media_event
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_media_file
        FOREIGN KEY (media_file_id) REFERENCES media_files(id) ON DELETE RESTRICT,
    CONSTRAINT uq_event_media_pair
        UNIQUE (event_id, media_file_id)
);

-- One banner, thumbnail and logo per event; multiple gallery images allowed.
CREATE UNIQUE INDEX uq_event_media_single_role
    ON event_media(event_id, media_role)
    WHERE media_role IN ('BANNER', 'THUMBNAIL', 'LOGO');

CREATE INDEX idx_event_media_event_order
    ON event_media(event_id, media_role, display_order);

-- ---------------------------------------------------------------------------
-- 5. EVENT_SPEAKERS: speakers associated with an event
-- ---------------------------------------------------------------------------

CREATE TABLE event_speakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    organization VARCHAR(255),
    bio TEXT,
    profile_url TEXT,
    photo_media_id UUID,
    display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_speakers_event
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_speakers_photo
        FOREIGN KEY (photo_media_id) REFERENCES media_files(id) ON DELETE SET NULL,
    CONSTRAINT uq_event_speaker_id_event
        UNIQUE (id, event_id)
);

CREATE INDEX idx_event_speakers_event_order
    ON event_speakers(event_id, display_order);

-- ---------------------------------------------------------------------------
-- 6. EVENT_SESSIONS: agenda/session entries belonging to an event
-- ---------------------------------------------------------------------------

CREATE TABLE event_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME WITHOUT TIME ZONE NOT NULL,
    end_time TIME WITHOUT TIME ZONE NOT NULL,
    venue VARCHAR(255),
    display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_sessions_event
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT chk_event_sessions_date_range
        CHECK (end_date >= start_date),
    CONSTRAINT chk_event_sessions_time_range
        CHECK (
            start_date <> end_date
            OR end_time > start_time
        ),
    CONSTRAINT uq_event_session_id_event
        UNIQUE (id, event_id)
);

CREATE INDEX idx_event_sessions_event_schedule
    ON event_sessions(event_id, start_date, start_time);

-- ---------------------------------------------------------------------------
-- 7. EVENT_SESSION_SPEAKERS: many-to-many session/speaker relationship
-- event_id ensures a session cannot be linked to a speaker from another event.
-- ---------------------------------------------------------------------------

CREATE TABLE event_session_speakers (
    event_id UUID NOT NULL,
    session_id UUID NOT NULL,
    speaker_id UUID NOT NULL,

    PRIMARY KEY (session_id, speaker_id),

    CONSTRAINT fk_session_speakers_event
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_session_speakers_session
        FOREIGN KEY (session_id, event_id)
        REFERENCES event_sessions(id, event_id) ON DELETE CASCADE,
    CONSTRAINT fk_session_speakers_speaker
        FOREIGN KEY (speaker_id, event_id)
        REFERENCES event_speakers(id, event_id) ON DELETE CASCADE
);

CREATE INDEX idx_event_session_speakers_speaker
    ON event_session_speakers(speaker_id);

-- ---------------------------------------------------------------------------
-- 8. EVENT_FACILITIES: facilities/amenities offered by an event
-- ---------------------------------------------------------------------------

CREATE TABLE event_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    facility_name VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),

    CONSTRAINT fk_event_facilities_event
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT uq_event_facility_name
        UNIQUE (event_id, facility_name)
);

CREATE INDEX idx_event_facilities_event
    ON event_facilities(event_id);

-- ---------------------------------------------------------------------------
-- 9. EVENT_AUDIENCES: intended audience groups for an event
-- ---------------------------------------------------------------------------

CREATE TABLE event_audiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    audience_type VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),

    CONSTRAINT fk_event_audiences_event
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT uq_event_audience_type
        UNIQUE (event_id, audience_type)
);

CREATE INDEX idx_event_audiences_event
    ON event_audiences(event_id);

-- ---------------------------------------------------------------------------
-- 10. General indexes for public event discovery
-- ---------------------------------------------------------------------------

CREATE INDEX idx_events_status
    ON events(status);

CREATE INDEX idx_events_category
    ON events(category);

CREATE INDEX idx_events_city
    ON events(city);

CREATE INDEX idx_events_start_date
    ON events(start_date);

CREATE INDEX idx_events_event_type
    ON events(event_type);

CREATE INDEX idx_events_status_start_date
    ON events(status, start_date);

CREATE INDEX idx_events_published_start_date
    ON events(start_date)
    WHERE status = 'published';

COMMIT;

-- ---------------------------------------------------------------------------
-- APPLICATION IMPLEMENTATION NOTES
-- ---------------------------------------------------------------------------
-- 1. Update events.updated_at in the application or with a database trigger.
--    The original Java entity uses @PrePersist/@PreUpdate callbacks.
-- 2. Validate actual uploaded file content in the backend; MIME type and
--    extension checks alone are insufficient.
-- 3. Store image bytes in managed file/object storage. Store only metadata
--    and storage_key in media_files.
-- 4. Enforce upload size/type restrictions in the backend as well as here.
-- 5. Do not expose storage_key or internal filesystem paths to public clients.
--    Serve images through an authorized backend endpoint or controlled CDN.
-- 6. Validate that event sessions fall within their parent event's schedule
--    in the service layer (cross-table checks cannot be expressed as ordinary
--    CHECK constraints).
-- 7. Validate event-type-specific requirements (e.g. venue for OFFLINE,
--    meeting details for ONLINE) in the service layer.
-- 8. This schema does not create user/account/booking/payment tables. Those
--    belong to the respective team modules and require a separately agreed
--    shared contract.
-- 9. If organizer identity must reference an authenticated user/organization,
--    add the appropriate FK only after the identity schema is finalized.
-- 10. `event_level`, `audience_type`, and `facility_name` are strings because
--     the exact admin form options are not yet confirmed. The application
--     should standardize the allowed values.
