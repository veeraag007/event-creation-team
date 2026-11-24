// Displays published events using the event lifecycle API and links to event details.
'use client';

import { useEffect, useState } from 'react';
import Workspace from '../attendee/Workspace';
import { publishedEvents, eventDate } from '../attendee/eventsApi';
import styles from '../attendee/account.module.css';

function EventList() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    publishedEvents(page, controller.signal).then(setData).catch(failure => {
      if (!controller.signal.aborted) setError(failure.message);
    });
    return () => controller.abort();
  }, [page]);

  function navigate(next) {
    setData(null);
    setError('');
    setPage(next);
  }

  if (error) return <p role="alert" className={styles.error}>{error}</p>;
  if (!data) return <p role="status">Loading events…</p>;
  return <>
    {data.content.length === 0 && <p className={styles.muted}>No published events are available yet.</p>}
    <div className={styles.grid}>
      {data.content.map(event => <article className={styles.panel} key={event.id}>
        <p className={styles.muted}>{event.category || 'Community event'}</p>
        <h2>{event.title}</h2>
        <p>{eventDate(event.startDateTime)}</p>
        <p>{event.venueName || event.venueMode || 'Venue to be announced'}</p>
        <a className={styles.link} href={`/events/${encodeURIComponent(event.id)}`}>View event details →</a>
      </article>)}
    </div>
    <div className={styles.nav} style={{ marginTop: 24 }}>
      <button className={styles.primary} disabled={page === 0} onClick={() => navigate(page - 1)}>Previous</button>
      <button className={styles.primary} disabled={page + 1 >= data.totalPages} onClick={() => navigate(page + 1)}>Next</button>
    </div>
  </>;
}

export default function Explore() {
  return <Workspace>{profile => <>
    <h1>Explore Events</h1>
    <p className={styles.muted}>Welcome, {profile.fullName}.</p>
    <EventList />
  </>}</Workspace>;
}
