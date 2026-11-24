// Displays the attendee account and saves name, phone and password changes.
'use client';

import { useState } from 'react';
import Workspace from '../attendee/Workspace';
import { attendeeRequest } from '../attendee/api';
import styles from '../attendee/account.module.css';

function ProfileForm({ profile, onUpdate }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function save(event, passwordChange = false) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setMessage('');
    setError('');
    if (passwordChange && data.newPassword !== data.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    delete data.confirmPassword;
    setBusy(true);
    try {
      const result = await attendeeRequest(passwordChange ? '/password' : '/me',
        passwordChange ? 'POST' : 'PUT', data);
      if (passwordChange) window.location.replace('/user-login');
      else { onUpdate(result); setMessage('Profile saved.'); }
    } catch (failure) {
      if (failure.status === 401) window.location.replace('/user-login');
      else setError(failure.message);
    } finally { setBusy(false); }
  }

  return <>
    <h1>My account</h1>
    <p className={styles.muted}>Manage your personal information and password.</p>
    <div className={styles.grid}>
      <section className={styles.panel}>
        <h2>Personal details</h2>
        <p className={styles.muted}>{profile.email}</p>
        <form className={styles.form} onSubmit={event => save(event)}>
          <label>Full name<input name="fullName" defaultValue={profile.fullName} maxLength={100} required /></label>
          <label>Phone number<input name="phone" type="tel" defaultValue={profile.phone || ''} maxLength={30} /></label>
          <button className={styles.primary} disabled={busy}>Save changes</button>
        </form>
      </section>
      <section className={styles.panel}>
        <h2>Change password</h2>
        <form className={styles.form} onSubmit={event => save(event, true)}>
          <label>Current password<input type="password" name="currentPassword" autoComplete="current-password" maxLength={72} required /></label>
          <label>New password<input type="password" name="newPassword" autoComplete="new-password" minLength={8} maxLength={72} required /></label>
          <label>Confirm new password<input type="password" name="confirmPassword" autoComplete="new-password" minLength={8} maxLength={72} required /></label>
          <button className={styles.primary} disabled={busy}>Change password</button>
        </form>
      </section>
    </div>
    {message && <p className={styles.status} role="status">{message}</p>}
    {error && <p className={styles.error} role="alert">{error}</p>}
  </>;
}

export default function Profile() {
  return <Workspace>{(profile, setProfile) => <ProfileForm profile={profile} onUpdate={setProfile} />}</Workspace>;
}
