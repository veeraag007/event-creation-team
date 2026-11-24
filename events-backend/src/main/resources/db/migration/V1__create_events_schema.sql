
-- ==========================================
-- EVENTRIX: Initial Events Database Schema
-- Migration: V1
-- ==========================================

CREATE TABLE events (
    id UUID PRIMARY KEY,

    -- Event status
    status VARCHAR(20) NOT NULL DEFAULT 'draft',

    -- Audit timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,

    -- Basic information
    title VARCHAR(255) NOT NULL,
    short_description VARCHAR(500),
    description TEXT,

    -- Classification
    category VARCHAR(100),
    subcategory VARCHAR(100),

    -- Event format
    event_type VARCHAR(20) NOT NULL,

    -- Schedule
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone VARCHAR(100),

    registration_start TIMESTAMP,
    registration_end TIMESTAMP,

    -- Venue and location
    venue_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    location_url TEXT,
    online_meeting_url TEXT,
    capacity INTEGER,

    -- Media
    banner_url TEXT,
    thumbnail_url TEXT,
    logo_url TEXT,

    -- Registration and ticket settings
    registration_required BOOLEAN NOT NULL DEFAULT TRUE,
    ticket_type VARCHAR(20) NOT NULL DEFAULT 'FREE',
    ticket_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    max_attendees INTEGER,
    registration_limit INTEGER,
    waitlist_enabled BOOLEAN NOT NULL DEFAULT FALSE,

    -- Validation constraints
    CONSTRAINT chk_event_status
        CHECK (status IN ('draft', 'published', 'unpublished', 'cancelled')),

    CONSTRAINT chk_event_type
        CHECK (event_type IN ('ONLINE', 'OFFLINE', 'HYBRID')),

    CONSTRAINT chk_ticket_type
        CHECK (ticket_type IN ('FREE', 'PAID')),

    CONSTRAINT chk_ticket_price
        CHECK (ticket_price >= 0),

    CONSTRAINT chk_event_capacity
        CHECK (capacity IS NULL OR capacity >= 0),

    CONSTRAINT chk_max_attendees
        CHECK (max_attendees IS NULL OR max_attendees >= 0),

    CONSTRAINT chk_registration_limit
        CHECK (registration_limit IS NULL OR registration_limit >= 0),

    CONSTRAINT chk_event_dates
        CHECK (end_date >= start_date)
);

-- Event tags: one event can have multiple tags
CREATE TABLE event_tags (
    event_id UUID NOT NULL,
    tag VARCHAR(100) NOT NULL,

    CONSTRAINT fk_event_tags_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    CONSTRAINT pk_event_tags
        PRIMARY KEY (event_id, tag)
);

-- Indexes for public event discovery
CREATE INDEX idx_events_status
    ON events(status);

CREATE INDEX idx_events_category
    ON events(category);

CREATE INDEX idx_events_city
    ON events(city);

CREATE INDEX idx_events_start_date
    ON events(start_date);

CREATE INDEX idx_events_type
    ON events(event_type);

CREATE INDEX idx_events_status_date
    ON events(status, start_date);
