
-- ==========================================
-- EVENTRIX: Facilities and Target Audiences
-- Migration: V6
-- ==========================================

-- Facilities available at an event.

CREATE TABLE event_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_id UUID NOT NULL,

    facility_name VARCHAR(150) NOT NULL,
    description TEXT,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_facilities_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_event_facilities_display_order
        CHECK (display_order >= 0),

    CONSTRAINT uq_event_facility_name
        UNIQUE (event_id, facility_name)
);

-- Intended audiences for an event.

CREATE TABLE event_audiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_id UUID NOT NULL,

    audience_type VARCHAR(150) NOT NULL,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_audiences_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_event_audiences_display_order
        CHECK (display_order >= 0),

    CONSTRAINT uq_event_audience_type
        UNIQUE (event_id, audience_type)
);

-- Lookup indexes.

CREATE INDEX idx_event_facilities_event
    ON event_facilities(event_id);

CREATE INDEX idx_event_audiences_event
    ON event_audiences(event_id);