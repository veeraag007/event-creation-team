// Manages the account notification preference and provides links to edit profile details.
'use client';
import Link from 'next/link';
import { useState } from 'react';
import Workspace from '../attendee/Workspace';
import { attendeeRequest } from '../attendee/api';
import s from '../attendee/account.module.css';

function Preferences({ profile, update }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function change() {
    setBusy(true);
    try {
      const enabled = !profile.notificationsEnabled;
      if (enabled && 'Notification' in window && await Notification.requestPermission() !== 'granted') {
        setMessage('Notifications are off. Allow notifications in your browser’s site settings to enable them.');
        return;
      }
      update(await attendeeRequest('/preferences','PUT',{ notificationsEnabled: enabled }));
      setMessage('Notification preference saved.');
    } catch (e) { setMessage(e.message); }
    finally { setBusy(false); }
  }
  return <><h1>Settings</h1><section className={s.panel}>
    <div className={s.setting}><div><h2>Allow notifications</h2><p className={s.muted}>Save your preference for event updates.</p></div>
      <button role="switch" aria-label="Allow notifications" aria-checked={profile.notificationsEnabled} className={s.primary} disabled={busy} onClick={change}>{profile.notificationsEnabled ? 'On' : 'Off'}</button></div>
    <Link className={s.setting} href="/profile">Profile settings <span>→</span></Link>
    <Link className={s.setting} href="/profile#location">Change location <span>{profile.location || 'Choose your city'} →</span></Link>
    {message && <p role="status">{message}</p>}
  </section></>;
}
export default function Settings() { return <Workspace>{(profile,update) => <Preferences profile={profile} update={update}/>}</Workspace>; }
