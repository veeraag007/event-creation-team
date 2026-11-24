// Renders attendee signup and login forms and redirects after successful authentication.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { attendeeRequest } from './api';
import styles from './account.module.css';

export default function AccountForm({ signup }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setError('');
    if (signup && data.password !== data.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    delete data.confirmPassword;
    setBusy(true);
    try {
      await attendeeRequest(signup ? '/register' : '/login', 'POST', data);
      router.push(signup ? '/user-login' : '/explore');
    } catch (failure) {
      setError(failure.message || 'Could not connect to the server.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/">Community 360 · Event Creation</a>
        <a href="/admin-login">Organizer login</a>
      </header>
      <main className={styles.card}>
        <h1>{signup ? 'Create your attendee account' : 'Welcome back'}</h1>
        <p>{signup ? 'Discover and register for community events.' : 'Sign in to discover events and manage your bookings.'}</p>
        <form className={styles.form} onSubmit={submit}>
          {signup && <label>Full name<input name="fullName" autoComplete="name" maxLength={100} required /></label>}
          <label>Email address<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
          <label>Password<input name="password" type={show ? 'text' : 'password'} autoComplete={signup ? 'new-password' : 'current-password'} minLength={signup ? 8 : undefined} maxLength={72} required /></label>
          {signup && <label>Confirm password<input name="confirmPassword" type={show ? 'text' : 'password'} autoComplete="new-password" minLength={8} maxLength={72} required /></label>}
          <button type="button" className={styles.link} onClick={() => setShow(!show)} style={{ background: 'transparent', border: 0, textAlign: 'left', cursor: 'pointer' }}>{show ? 'Hide passwords' : 'Show passwords'}</button>
          {error && <p role="alert" className={styles.error}>{error}</p>}
          <button className={styles.primary} disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}</button>
        </form>
        <p>{signup ? 'Already registered? ' : 'New to Community 360? '}<a className={styles.link} href={signup ? '/user-login' : '/user-registration'}>{signup ? 'Sign in' : 'Create an account'}</a></p>
      </main>
    </div>
  );
}
