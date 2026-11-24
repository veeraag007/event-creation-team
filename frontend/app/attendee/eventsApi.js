// Adapts Member 3's paginated published-event API to the authenticated attendee workspace.
const base = process.env.NEXT_PUBLIC_EVENTS_API_URL || 'http://localhost:8081';
async function readEventData(path, signal) {
  const response = await fetch(`${base}/api/events${path}`, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error(response.status === 404 ? 'Published event not found.' : 'Could not load event information.');
  const envelope = await response.json();
  if (!envelope.success || !envelope.data) throw new Error('Event data is unavailable.');
  return envelope;
}
// Fetch every page before filtering, rather than searching only the first 100 events.
export async function allPublishedEvents(signal) {
  const events = new Map();
  let page = 0;
  while (true) {
    const result = await readEventData(`/published?page=${page}&size=100`, signal);
    if (!Array.isArray(result.data) || !Number.isInteger(result.pagination?.totalPages)) throw new Error('Unexpected event-service response.');
    for (const event of result.data) {
      if (event.status?.toLowerCase() === 'published') events.set(event.id, event);
    }
    if (++page >= result.pagination.totalPages) return [...events.values()];
    if (page >= 100) throw new Error('Too many events to load at once. Please contact the administrator.');
  }
}
export async function eventDetails(id, signal) {
  const { data: event } = await readEventData(`/${encodeURIComponent(id)}`, signal);
  if (event.status?.toLowerCase() !== 'published') throw new Error('This event is no longer available.');
  return event;
}
export function eventDate(value) {
  if (!value) return 'Date to be announced';
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN', { dateStyle: 'medium' });
}
export function eventTime(value) {
  if (!value) return '';
  const match = /^(\d{2}):(\d{2})/.exec(value);
  if (!match) return value;
  const hour = Number(match[1]);
  return `${hour % 12 || 12}:${match[2]} ${hour >= 12 ? 'PM' : 'AM'}`;
}
export function safeWebUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
export function priceLabel(event) {
  if (event.ticketType === 'FREE') return 'Free';
  if (event.ticketPrice == null || !Number.isFinite(Number(event.ticketPrice))) return 'Price to be announced';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(event.ticketPrice));
}
