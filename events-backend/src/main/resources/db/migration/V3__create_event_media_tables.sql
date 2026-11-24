-- ==========================================
-- EVENTRIX: Media Storage and Event Media
-- Migration: V3
-- ==========================================

-- Stores metadata for actual uploaded files.
-- The file contents remain in filesystem/object storage.

CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL UNIQUE,

    storage_provider VARCHAR(20) NOT NULL,
    storage_key TEXT NOT NULL UNIQUE,

    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    checksum_sha256 VARCHAR(64),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_media_storage_provider
        CHECK (storage_provider IN ('LOCAL', 'S3', 'MINIO', 'OTHER')),

    CONSTRAINT chk_media_mime_type
        CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')),

    CONSTRAINT chk_media_file_size
        CHECK (file_size_bytes > 0 AND file_size_bytes <= 5242880)
);

-- Associates uploaded media files with events.

CREATE TABLE event_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_id UUID NOT NULL,
    media_file_id UUID NOT NULL,

    media_role VARCHAR(20) NOT NULL,
    alt_text VARCHAR(500),

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_media_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_event_media_file
        FOREIGN KEY (media_file_id)
        REFERENCES media_files(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_event_media_role
        CHECK (media_role IN ('BANNER', 'THUMBNAIL', 'LOGO', 'GALLERY')),

    CONSTRAINT chk_event_media_display_order
        CHECK (display_order >= 0),

    CONSTRAINT uq_event_media_file
        UNIQUE (event_id, media_file_id)
);

-- An event can have only one banner, thumbnail, and logo.
-- It can have multiple gallery images.

CREATE UNIQUE INDEX uq_event_media_single_primary_role
    ON event_media(event_id, media_role)
    WHERE media_role IN ('BANNER', 'THUMBNAIL', 'LOGO');

-- Lookup indexes.

CREATE INDEX idx_event_media_event
    ON event_media(event_id);

CREATE INDEX idx_event_media_file
    ON event_media(media_file_id);

CREATE INDEX idx_event_media_role
    ON event_media(event_id, media_role);