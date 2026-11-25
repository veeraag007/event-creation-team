// Loads the authenticated attendee and provides shared navigation and logout.
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { attendeeRequest } from './api';
import Icon from './Icon';
import ProfileMenu from './ProfileMenu';
import { FavoritesProvider } from './Favorites';
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
      <Link href="/home" className={styles.brand}><span className={styles.logo}>C</span><span>Community 360<small>EVENT CREATION</small></span></Link>
      <nav aria-label="Attendee navigation" className={styles.nav}>
        {[[ '/home', 'home', 'Home' ],[ '/explore', 'explore', 'Explore Events' ],[ '/my-events', 'tickets', 'My Events' ]].map(([url, icon, label]) =>
          <Link key={url} href={url} aria-label={label} title={label} className={styles.iconBtn}><Icon name={icon}/></Link>)}
        {profile && <ProfileMenu profile={profile} logout={logout} busy={loggingOut}/>}
      </nav>
    </header>
    <main className={styles.workspace}>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {profile ? <FavoritesProvider>{children(profile, setProfile)}</FavoritesProvider> : !error && <p role="status">Loading your account…</p>}
    </main>
  </div>;
}
