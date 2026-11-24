// Shared admin and attendee signup/login UI, including OTP and Community ID confirmation.
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { accountRequest } from './api';
import styles from './account.module.css';

export default function AccountForm({ signup = false, admin = false }) {
  const router = useRouter();
  const role = admin ? 'admin' : 'attendee';
  const login = admin ? '/admin-login' : '/user-login';
  const register = admin ? '/admin-registration' : '/user-registration';
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(null);
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');
  const [complete, setComplete] = useState(null);
  async function send(data, code) {
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await accountRequest(role, signup ? '/register' : '/login', 'POST', { ...data, ...(code ? { code } : {}) });
      if (result.verificationRequired) {
        setPending(data); setEmail(result.email);
        setNotice('A six-digit code was sent. Check your inbox and spam folder.');
        return;
      }
      setPending(null);
      if (signup) setComplete(result);
      else router.replace(admin ? '/admin/dashboard' : '/explore');
    } catch (failure) { setError(failure.message || 'Could not connect to the server.'); }
    finally { setBusy(false); }
  }
  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (pending) return send(pending, data.code.trim());
    if (signup && data.password !== data.confirmPassword) { setError('Passwords do not match.'); return; }
    delete data.confirmPassword;
    await send(data);
  }
  return <div className={styles.page}>
    <header className={styles.header}>
      <Link href="/" className={styles.brand}><span className={styles.logo}>C</span><span>Community 360 <small>EVENT CREATION</small></span></Link>
      <Link href={admin ? '/user-login' : '/admin-login'}>{admin ? 'Attendee login' : 'Admin login'} →</Link>
    </header>
    <div className={styles.authLayout}>
      <section className={styles.intro}>
        <Link className={styles.link} href="/">← Back to home</Link>
        <div className={styles.eyebrow}>{admin ? 'ORGANIZER WORKSPACE' : 'ATTENDEE EXPERIENCE'}</div>
        <h1>{admin ? 'Bring your community together.' : 'Discover your next experience.'}</h1>
        <p>{admin ? 'Create events and manage your community from one central platform.' : 'Explore community events and manage your registrations in one place.'}</p>
        <p className={styles.securityNote}>✓ Email ownership verification<br />✓ Secure account access</p>
      </section>
      <main className={styles.card}>
        {complete ? <>
          <div className={styles.successIcon}>✓</div><h1>Account created!</h1><p>Your email has been verified successfully.</p>
          {admin && <div className={styles.idBox}><small>Your Community 360 ID</small><strong>{complete.communityId}</strong><p>Save this ID, or sign in using your email.</p></div>}
          <Link className={styles.primary} href={login}>Continue to login →</Link>
        </> : <>
          <h1>{pending ? 'Verify your email' : signup ? `Create your ${role} account` : `${admin ? 'Admin' : 'Attendee'} Login`}</h1>
          <p>{pending ? `Enter the verification code sent to ${email}.` : signup ? 'Enter your details to get started.' : 'Welcome back. Sign in to continue.'}</p>
          <form key={pending ? 'verify' : 'credentials'} className={styles.form} onSubmit={submit}>
            {pending ? <>
              <label>Verification code<input name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" placeholder="000000" required /></label>
              <p>Code expires in 10 minutes. You can request another after 60 seconds.</p>
            </> : <>
              {signup && <label>Full name<input name="fullName" autoComplete="name" maxLength={100} required /></label>}
              {admin && signup && <label>Organization name<input name="organization" autoComplete="organization" maxLength={150} required /></label>}
              {admin && !signup ? <label>Community 360 ID or email<input name="communityId" autoComplete="username" maxLength={254} required /></label>
                : <label>Email address<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>}
              <label>Password<input name="password" type={show ? 'text' : 'password'} autoComplete={signup ? 'new-password' : 'current-password'} minLength={signup ? 8 : undefined} maxLength={72} required /></label>
              {signup && <label>Confirm password<input name="confirmPassword" type={show ? 'text' : 'password'} autoComplete="new-password" minLength={8} maxLength={72} required /></label>}
              <button type="button" className={styles.textButton} onClick={() => setShow(!show)}>{show ? 'Hide password' : 'Show password'}</button>
            </>}
            {error && <p role="alert" className={styles.error}>{error}</p>}
            {notice && <p role="status" className={styles.status}>{notice}</p>}
            <button className={styles.primary} disabled={busy}>{busy ? 'Please wait…' : pending ? 'Verify and continue' : signup ? 'Send verification code →' : 'Sign in →'}</button>
            {pending && <div className={styles.nav}><button type="button" className={styles.textButton} disabled={busy} onClick={() => send(pending)}>Resend code</button><button type="button" className={styles.textButton} disabled={busy} onClick={() => { setPending(null); setNotice(''); setError(''); }}>Change details</button></div>}
          </form>
          <p>{signup ? 'Already registered? ' : 'New to Community 360? '}<Link className={styles.link} href={signup ? login : register}>{signup ? 'Sign in' : 'Create an account'}</Link></p>
        </>}
      </main>
    </div>
  </div>;
}
