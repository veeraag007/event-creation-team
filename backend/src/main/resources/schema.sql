-- Creates the admin ID sequence without resetting existing account IDs.
CREATE SEQUENCE IF NOT EXISTS public.admin_id_seq START WITH 1 INCREMENT BY 1;

-- One organization per signed-in Community ID. Operational rows belong to that workspace.
CREATE TABLE IF NOT EXISTS organization_workspaces (
    owner_id text PRIMARY KEY, slug text NOT NULL UNIQUE, configuration jsonb NOT NULL,
    launched_at timestamptz NOT NULL DEFAULT now(), trial_ends_at timestamptz NOT NULL DEFAULT now() + interval '14 days'
);
CREATE TABLE IF NOT EXISTS organization_events (
    id uuid PRIMARY KEY, owner_id text NOT NULL REFERENCES organization_workspaces(owner_id),
    name text NOT NULL, start_date date NOT NULL, venue text, status text NOT NULL
);
CREATE INDEX IF NOT EXISTS organization_events_owner ON organization_events(owner_id);
CREATE TABLE IF NOT EXISTS organization_registrations (
    id uuid PRIMARY KEY, event_id uuid NOT NULL REFERENCES organization_events(id),
    attendee_id text NOT NULL, status text NOT NULL, UNIQUE(event_id, attendee_id)
);
CREATE TABLE IF NOT EXISTS organization_members (
    id uuid PRIMARY KEY, owner_id text NOT NULL REFERENCES organization_workspaces(owner_id),
    name text NOT NULL, email text NOT NULL, UNIQUE(owner_id,email)
);
