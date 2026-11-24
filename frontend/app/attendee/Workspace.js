// Loads the authenticated attendee and provides shared navigation and logout.
'use client';

import { useEffect, useState } from 'react';
import { attendeeRequest } from './api';
import styles from './account.module.css';

export default function Workspace({ children }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  useEffect(() => {
    let active = true;
    attendeeRequest('/me').then(data => {
      if (active) setProfile(data);
    }).catch(failure => {
      if (!active) return;
      if (failure.status === 401) window.location.replace('/user-login');
      else setError(failure.message);
    });
    return () => { active = false; };
  }, []);

  async function logout() {
    setLoggingOut(true);
    try {
      await attendeeRequest('/logout', 'POST', {});
      window.location.replace('/user-login');
    } catch (failure) {
      setError(failure.message);
      setLoggingOut(false);
    }
  }

  return <div className={styles.page}>
    <header className={styles.header}>
      <a href="/">Community 360</a>
      <nav className={styles.nav}><a href="/explore">Explore Events</a><a href="/my-events">My Events</a><a href="/profile">Profile</a><button className={styles.primary} disabled={loggingOut} onClick={logout}>Sign out</button></nav>
    </header>
    <main className={styles.workspace}>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {profile ? children(profile, setProfile) : !error && <p role="status">Loading your account…</p>}
    </main>
  </div>;
}
