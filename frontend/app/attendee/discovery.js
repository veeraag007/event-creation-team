// Port of Member 3's search, suggestions, filters and sorting logic.
export const initialFilters = { search: '', category: '', type: '', date: '', city: '', price: '', status: '', sort: 'date-asc' };
const text = value => String(value ?? '').toLowerCase();
export function suggestions(events, search) {
  const keyword = text(search).trim();
  if (!keyword) return [];
  return [...new Set(events.flatMap(event => [event.title, event.category, event.city, event.venueName]).filter(Boolean))]
    .filter(value => text(value).includes(keyword) && text(value) !== keyword).slice(0, 5);
}
export function filterEvents(events, filters, today) {
  const keyword = text(filters.search).trim();
  const dateKey = event => `${event.startDate || ''}T${event.startTime || ''}`;
  return events.filter(event => {
    const searchable = [event.title, event.description, event.shortDescription, event.category, event.city, event.venueName, ...(event.tags || [])];
    return (!keyword || searchable.some(value => text(value).includes(keyword)))
      && (!filters.category || event.category === filters.category)
      && (!filters.type || event.eventType === filters.type)
      && (!filters.date || event.startDate === filters.date)
      && (!filters.city || event.city === filters.city)
      && (!filters.price || event.ticketType === filters.price)
      && (!filters.status || (filters.status === 'upcoming' ? (event.endDate || event.startDate) >= today : (event.endDate || event.startDate) < today));
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'date-desc': return dateKey(b).localeCompare(dateKey(a));
      case 'name': return text(a.title).localeCompare(text(b.title));
      case 'price-asc': return Number(a.ticketPrice || 0) - Number(b.ticketPrice || 0);
      case 'price-desc': return Number(b.ticketPrice || 0) - Number(a.ticketPrice || 0);
      default: return dateKey(a).localeCompare(dateKey(b));
    }
  });
}
