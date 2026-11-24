// Shows the authenticated attendee's booking area pending the ticket booking API integration.
'use client';

import Workspace from '../attendee/Workspace';
import styles from '../attendee/account.module.css';

export default function MyEvents() {
  return <Workspace>{() => <>
    <h1>My Events</h1>
    <section className={styles.panel}>
      <h2>Your bookings</h2>
      <p className={styles.muted}>Booking information is unavailable until the Ticket Booking service is connected.</p>
      <a className={styles.link} href="/explore">Explore Events →</a>
    </section>
  </>}</Workspace>;
}
