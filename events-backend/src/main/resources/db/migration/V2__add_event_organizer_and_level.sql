-- ==========================================
-- EVENTRIX: Event Organizer and Level Fields
-- Migration: V2
-- ==========================================

ALTER TABLE events
    ADD COLUMN event_level VARCHAR(50),
    ADD COLUMN organizer_name VARCHAR(255),
    ADD COLUMN organizer_contact_name VARCHAR(255),
    ADD COLUMN organizer_email VARCHAR(255),
    ADD COLUMN organizer_phone VARCHAR(50),
    ADD COLUMN organizer_website TEXT;