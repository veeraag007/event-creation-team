// Loads published events and displays compact, saveable event cards on Home and Wishlist.
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { allPublishedEvents, eventDate, safeWebUrl } from './eventsApi';
import { Heart } from './Favorites';
import s from './account.module.css';

export function useEventFeed() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    allPublishedEvents(controller.signal).then(data => { if (!controller.signal.aborted) setEvents(data); })
      .catch(e => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, [attempt]);
  return { events, error, retry() { setError(''); setAttempt(n => n + 1); } };
}
export function EventTiles({ events, empty }) {
  if (!events.length) return <p className={s.quiet}>{empty}</p>;
  return <div className={s.tiles}>{events.map(event => {
    const image = safeWebUrl(event.thumbnailUrl || event.bannerUrl);
    return <article className={s.tile} key={event.id}>
      <Link href={'/events/' + encodeURIComponent(event.id)}>
        <div className={s.tileImage} style={image ? {backgroundImage:'url(' + JSON.stringify(image) + ')'} : undefined}/>
        <div><small>{eventDate(event.startDate)} · {event.city || event.eventType}</small><h3>{event.title}</h3></div>
      </Link><Heart event={event}/>
    </article>;
  })}</div>;
}
