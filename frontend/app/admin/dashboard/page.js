// Session-protected admin handoff page; detailed organization onboarding comes next.

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { accountRequest } from '../../attendee/api';
import styles from '../../attendee/account.module.css';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAdmin() {
      try {
        setAdmin(await accountRequest('admin', '/me'));
      } catch (failure) {
        if (failure.status === 401) window.location.replace('/admin-login');
        else setError(failure.message || 'Could not connect to Spring Boot.');
      }
    }

    loadAdmin();
  }, []);

  async function logout() {
    try {
      await accountRequest('admin', '/logout', 'POST', {});
      window.location.replace('/admin-login');
    } catch (failure) { setError(failure.message); }
  }
  return <div className={styles.page}>
    <header className={styles.header}><Link href="/" className={styles.brand}><span className={styles.logo}>C</span>Community 360</Link><button className={styles.primary} onClick={logout}>Sign out</button></header>
    <main className={styles.workspace}>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {!admin ? !error && <p>Loading workspace…</p> : <>
        <p className={styles.eyebrow}>ORGANIZER WORKSPACE</p><h1>Welcome, {admin.fullName}</h1>
        <section className={styles.panel}><h2>Account verified</h2><p>Organization: {admin.organization}</p><p>Community ID: {admin.communityId}</p><p>Email: {admin.email}</p></section>
        <section className={styles.panel}><h2>Organization onboarding</h2><p className={styles.muted}>Your admin account is ready. Detailed organization setup and dashboard integration are the next modules.</p></section>
      </>}
    </main>
  </div>;
}
