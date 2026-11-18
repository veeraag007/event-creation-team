import { useCallback, useEffect, useRef, useState } from 'react';
import { CommunityEvent } from '../types';
import { fetchEvents, saveEvent } from './eventsApi';

const POLL_MS = 8000;

/**
 * Loads events from the shared events service and keeps them fresh so changes
 * made in the other micro-app show up here. Falls back to seed data (offline
 * mode) when the service is not running.
 */
export function useEvents() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'api' | 'offline'>('offline');
  const lastJson = useRef('');
  const dirty = useRef(false);

  const refresh = useCallback(async () => {
    const result = await fetchEvents();
    setSource(result.source);
    const json = JSON.stringify(result.events);
    // In offline mode local edits are the source of truth – never overwrite them.
    if (result.source === 'offline' && dirty.current) {
      setLoading(false);
      return;
    }
    if (json !== lastJson.current) {
      lastJson.current = json;
      setEvents(result.events);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  /** Insert or replace an event locally and persist it to the service. */
  const upsertEvent = useCallback(async (event: CommunityEvent) => {
    dirty.current = true;
    setEvents(prev =>
      prev.some(e => e.id === event.id)
        ? prev.map(e => (e.id === event.id ? event : e))
        : [event, ...prev]
    );
    const ok = await saveEvent(event);
    if (ok) {
      dirty.current = false;
      lastJson.current = '';
    }
    return ok;
  }, []);

  return { events, loading, source, upsertEvent, refresh };
}
