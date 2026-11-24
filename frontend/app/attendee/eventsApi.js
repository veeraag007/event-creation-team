// Reads the event lifecycle team's published-event API without using hardcoded events.
const base = process.env.NEXT_PUBLIC_EVENTS_API_URL || 'http://localhost:8081';

async function readEventData(path, signal) {
  const response = await fetch(`${base}/api/events${path}`, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error('Could not load event information.');
  const envelope = await response.json();
  if (!envelope.success || !envelope.data) throw new Error('Event data is unavailable.');
  return envelope.data;
}

export function publishedEvents(page, signal) {
  return readEventData(`/published?page=${page}&size=12`, signal);
}

export async function eventDetails(id, signal) {
  const event = await readEventData(`/${encodeURIComponent(id)}`, signal);
  if (event.status?.toLowerCase() !== 'published') {
    throw new Error('This event is no longer available.');
  }
  return event;
}

export function eventDate(value) {
  if (!value) return 'Date to be announced';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export function safeWebUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
