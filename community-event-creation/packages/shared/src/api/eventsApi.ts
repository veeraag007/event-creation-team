import { CommunityEvent } from '../types';
import { INITIAL_EVENTS } from '../data/eventData';

const API_URL: string =
  (import.meta.env?.VITE_API_URL as string | undefined) ?? 'http://localhost:4000';

export interface EventsResult {
  events: CommunityEvent[];
  /** 'api' when served by the shared events service, 'offline' when falling back to seed data. */
  source: 'api' | 'offline';
}

export async function fetchEvents(): Promise<EventsResult> {
  try {
    const res = await fetch(`${API_URL}/api/events`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { events: (await res.json()) as CommunityEvent[], source: 'api' };
  } catch {
    return { events: INITIAL_EVENTS, source: 'offline' };
  }
}

/** Create or update an event. Resolves false when the API is unreachable. */
export async function saveEvent(event: CommunityEvent): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/events/${encodeURIComponent(event.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    return res.ok;
  } catch {
    return false;
  }
}
