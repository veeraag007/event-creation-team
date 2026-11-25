// Displays the attendee avatar and the account navigation popover.
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import s from './account.module.css';

const links = [['person','Account details','/profile'], ['heart','Wishlist','/wishlist'], ['tickets','My Events','/my-events'], ['settings','Settings','/settings']];
export default function ProfileMenu({ profile, logout, busy }) {
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    if (!open) return;
    function outside(e) { if (!container.current?.contains(e.target)) setOpen(false); }
    function escape(e) { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  const initials = profile.fullName.trim().split(/\s+/).slice(0,2).map(word => word[0]).join('').toUpperCase();
  return <div ref={container} className={s.menuWrap}>
    <button ref={toggle} className={s.avatar} aria-label="Account menu" aria-expanded={open} aria-controls="account-links" onClick={() => setOpen(!open)}>{initials}</button>
    {open && <div id="account-links" className={s.popover}>
      <div className={s.identity}><b className={s.avatar}>{initials}</b><div><strong>{profile.fullName}</strong><small>Attendee</small></div></div>
      {links.map(([icon,label,url]) => <Link key={url} href={url} onClick={() => setOpen(false)}><Icon name={icon}/>{label}</Link>)}
      <button disabled={busy} onClick={logout}><Icon name="logout"/>{busy ? 'Logging out…' : 'Log out'}</button>
    </div>}
  </div>;
}
