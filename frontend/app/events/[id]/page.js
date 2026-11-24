// Shows details for a published event selected from the discovery page.
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Workspace from '../../attendee/Workspace';
import { eventDetails, eventDate, safeWebUrl } from '../../attendee/eventsApi';
import styles from '../../attendee/account.module.css';

function Details({ id }) {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    eventDetails(id, controller.signal).then(setEvent).catch(failure => {
      if (!controller.signal.aborted) setError(failure.message);
    });
    return () => controller.abort();
  }, [id]);
  if (error) return <p role="alert" className={styles.error}>{error}</p>;
  if (!event) return <p role="status">Loading event details…</p>;
  const map = safeWebUrl(event.mapLink);
  const banner = safeWebUrl(event.bannerUrl);
  return <>
    <a className={styles.link} href="/explore">← All events</a>
    {banner && <div className={styles.banner} role="img" aria-label={`${event.title} banner`} style={{ backgroundImage: `url("${banner.replaceAll('"', '%22')}")` }} />}
    <section className={styles.panel}>
      <p className={styles.muted}>{event.category || 'Community event'}</p>
      <h1>{event.title}</h1>
      <p className={styles.muted}>{event.description || 'Event description to be announced.'}</p>
    </section>
    <div className={styles.grid}>
      <section className={styles.panel}>
        <h2>Date and time</h2>
        <p>{eventDate(event.startDateTime)} – {eventDate(event.endDateTime)}</p>
        <h2>Venue</h2>
        <p>{[event.venueName, event.address, event.city].filter(Boolean).join(', ') || event.venueMode || 'To be announced'}</p>
        {map && <a className={styles.link} href={map} target="_blank" rel="noreferrer">Open venue map</a>}
      </section>
      <section className={styles.panel}>
        <h2>Event information</h2>
        <p>Speaker: {event.speaker || 'To be announced'}</p>
        <p>Ticketing and booking information will be available once the booking service is connected.</p>
      </section>
    </div>
  </>;
}

function EventDetailsRoute() {
  const { id } = useParams();
  return <Workspace>{() => <Details key={id} id={id} />}</Workspace>;
}

export default function EventDetails() {
  return <Suspense fallback={<p role="status">Loading event details…</p>}><EventDetailsRoute /></Suspense>;
}
