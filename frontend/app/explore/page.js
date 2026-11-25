// Member 3's event discovery, integrated behind attendee login with real backend data.
'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Heart } from '../attendee/Favorites';
import Workspace from '../attendee/Workspace';
import { allPublishedEvents, eventDate, eventTime, priceLabel, safeWebUrl } from '../attendee/eventsApi';
import { initialFilters, filterEvents, suggestions } from '../attendee/discovery';
import styles from '../attendee/account.module.css';

const PER_PAGE = 6;
function Select({ label, value, onChange, items }) {
  return <label>{label}<select value={value} onChange={event => onChange(event.target.value)}>{items.map(([id, text]) => <option value={id} key={id}>{text}</option>)}</select></label>;
}
function EventList() {
  const [filters, setFilters] = useState(() => {
    const query = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
    return { ...initialFilters, category: query.get('category') || '', city: query.get('city') || '' };
  });
  const [events, setEvents] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [today, setToday] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    const now = new Date();
    const day = [now.getFullYear(), String(now.getMonth() + 1).padStart(2,'0'), String(now.getDate()).padStart(2,'0')].join('-');
    allPublishedEvents(controller.signal).then(data => { if (!controller.signal.aborted) { setEvents(data); setToday(day); } }).catch(failure => {
      if (!controller.signal.aborted) setError(failure.message);
    });
    return () => controller.abort();
  }, [reload]);
  const available = useMemo(() => events || [], [events]);
  const filtered = useMemo(() => filterEvents(available, filters, today), [available, filters, today]);
  const recommendations = suggestions(available, filters.search);
  const options = field => [...new Set([filters[field], ...available.map(event => event[field])].filter(Boolean))].sort().map(value => [value, value]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const change = (field, value) => { setFilters(previous => ({ ...previous, [field]: value })); setPage(1); };
  return <>
    <section className={styles.filters}>
      <div className={styles.searchBox}><label>Search events<input value={filters.search} onChange={event => { change('search', event.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} onKeyDown={event => { if (['Escape','Enter'].includes(event.key)) setShowSuggestions(false); }} placeholder="Event name, category, location or venue" /></label>
        {showSuggestions && recommendations.length > 0 && <div className={styles.suggestions}>{recommendations.map(value => <button key={value} type="button" onClick={() => { change('search', value); setShowSuggestions(false); }}>{value}</button>)}</div>}
      </div>
      <Select label="Category" value={filters.category} onChange={v => change('category',v)} items={[[ '', 'All categories'], ...options('category')]} />
      <Select label="Event type" value={filters.type} onChange={v => change('type',v)} items={[[ '', 'All types'],['ONLINE','Online'],['OFFLINE','Offline'],['HYBRID','Hybrid']]} />
      <label>Date<input type="date" value={filters.date} onChange={event => change('date',event.target.value)} /></label>
      <Select label="Location" value={filters.city} onChange={v => change('city',v)} items={[[ '', 'All locations'], ...options('city')]} />
      <Select label="Price" value={filters.price} onChange={v => change('price',v)} items={[[ '', 'All prices'],['FREE','Free events'],['PAID','Paid events']]} />
      <Select label="Status" value={filters.status} onChange={v => change('status',v)} items={[[ '', 'All events'],['upcoming','Upcoming'],['past','Past']]} />
      <Select label="Sort by" value={filters.sort} onChange={v => change('sort',v)} items={[[ 'date-asc', 'Date: earliest first'],['date-desc','Date: latest first'],['name','Name A–Z'],['price-asc','Price: low to high'],['price-desc','Price: high to low']]} />
      <button className={styles.textButton} onClick={() => { setFilters(initialFilters); setPage(1); setShowSuggestions(false); }}>Reset filters</button>
    </section>
    {error ? <section className={styles.panel}><p role="alert" className={styles.error}>{error} Make sure the events backend is running on port 8081.</p><button className={styles.primary} onClick={() => { setError(''); setEvents(null); setReload(reload + 1); }}>Retry</button></section>
      : !events ? <p role="status">Loading published events…</p>
        : <>
          <p className={styles.muted} role="status">{filtered.length} {filtered.length === 1 ? 'event' : 'events'} found</p>
          {filtered.length === 0 && <section className={styles.panel}><h2>No events found</h2><p>{events.length ? 'Try changing your filters.' : 'Published events will appear here when organizers publish them.'}</p></section>}
          <div className={styles.grid}>{filtered.slice((currentPage-1)*PER_PAGE,currentPage*PER_PAGE).map(event => {
            const banner = safeWebUrl(event.bannerUrl || event.thumbnailUrl);
            return <article className={styles.eventCard} key={event.id}>
              <div className={styles.eventImage} style={banner ? { backgroundImage:`url("${banner.replaceAll('"','%22')}")` } : undefined}><span>{event.category || 'Community event'}</span></div>
              <div className={styles.eventBody}><p className={styles.muted}>{eventDate(event.startDate)} · {eventTime(event.startTime)} · {event.eventType}</p><h2>{event.title}</h2><p>{event.shortDescription || event.description || 'See event details.'}</p><p className={styles.muted}>{[event.venueName,event.city].filter(Boolean).join(' · ') || (event.eventType === 'ONLINE' ? 'Online' : 'Venue to be announced')}</p><div className={styles.eventFooter}><strong>{priceLabel(event)}</strong><Heart event={event}/><Link className={styles.primary} href={`/events/${encodeURIComponent(event.id)}`}>View details →</Link></div></div>
            </article>;
          })}</div>
          {filtered.length > 0 && <div className={styles.pagination}><button className={styles.primary} disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><span>Page {currentPage} of {totalPages}</span><button className={styles.primary} disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Next</button></div>}
        </>}
  </>;
}
export default function Explore() {
  return <Workspace>{profile => <><p className={styles.eyebrow}>DISCOVER EXPERIENCES</p><h1>Explore Events</h1><p className={styles.muted}>Welcome, {profile.fullName}. Find your next community experience.</p><EventList /></>}</Workspace>;
}
