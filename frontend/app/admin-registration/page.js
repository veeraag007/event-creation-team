'use client';

import { useState } from 'react';
import styles from './registration.module.css';

export default function AdminRegistrationPage() {
  const [communityId, setCommunityId] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const details = Object.fromEntries(new FormData(form));

    setMessage('');

    if (details.password !== details.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        'http://localhost:8080/api/admin/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: details.fullName,
            organization: details.organization,
            email: details.email,
            password: details.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || 'Registration failed. Please check your details.');
        return;
      }

      setCommunityId(result.communityId);
      form.reset();

    } catch {
      setMessage('Unable to connect to the registration server.');
    } finally {
      setSaving(false);
    }
  }

  async function copyId() {
    try {
      await navigator.clipboard.writeText(communityId);
      setCopied(true);
    } catch {
      setMessage('Select and copy your Community 360 ID manually.');
    }
  }

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <a href="/" className={styles.brand}>
          <span className={styles.logo}>C</span>

          <div>
            <strong>Community 360</strong>
            <small>EVENT CREATION</small>
          </div>
        </a>

        <a href="/admin-login" className={styles.loginLink}>
          Admin Login →
        </a>
      </header>

      <main className={styles.container}>

        <section className={styles.intro}>
          <a href="/" className={styles.back}>
            ← Back to home
          </a>

          <h1>
            Bring your community <span>together.</span>
          </h1>

          <p className={styles.description}>
            Create your organization's workspace and start
            managing events, venues, registrations and attendees
            through Community 360.
          </p>

          <div className={styles.features}>

            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <h3>Organization workspace</h3>
                <p>Manage your community from one central platform.</p>
              </div>
            </div>

            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <h3>Event management</h3>
                <p>Create, organize and publish community events.</p>
              </div>
            </div>

            <div className={styles.feature}>
              <span>✓</span>
              <div>
                <h3>Venue and seating management</h3>
                <p>Configure venues and manage event capacity.</p>
              </div>
            </div>

          </div>
        </section>

        <section className={styles.card}>

          {communityId ? (

            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>

              <h2>Account created successfully!</h2>

              <p>Your Community 360 account is ready.</p>

              <div className={styles.idBox}>
                <small>Your Community 360 ID</small>

                <strong>{communityId}</strong>

                <button
                  type="button"
                  onClick={copyId}
                  className={styles.copyButton}
                >
                  {copied ? '✓ Copied' : 'Copy ID'}
                </button>
              </div>

              <p>
                Save this ID for future logins. You can also
                sign in using your registered email.
              </p>

              {message && (
                <p role="status">{message}</p>
              )}

              <a
                href="/admin-login"
                className={styles.primaryButton}
              >
                Continue to Admin Login →
              </a>
            </div>

          ) : (

            <>
              <h2>Create your admin account</h2>

              <p className={styles.subtitle}>
                Enter your details to register your organization.
              </p>

              <form
                className={styles.form}
                onSubmit={handleSubmit}
              >

                <label>
                  Full name
                  <input
                    name="fullName"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                </label>

                <label>
                  Organization name
                  <input
                    name="organization"
                    placeholder="Enter organization name"
                    autoComplete="organization"
                    maxLength={150}
                    required
                  />
                </label>

                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    placeholder="admin@organization.com"
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </label>

                <label>
                  Password

                  <div className={styles.passwordField}>
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={72}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <small>Minimum 8 characters.</small>
                </label>

                <label>
                  Confirm password
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                  />
                </label>

                {message && (
                  <div className={styles.error} role="alert">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={saving}
                >
                  {saving
                    ? 'Creating your account...'
                    : 'Create Admin Account →'}
                </button>

              </form>

              <p className={styles.footerText}>
                Already registered?{' '}
                <a href="/admin-login">Sign in</a>
              </p>
            </>
          )}
        </section>

      </main>

      <footer className={styles.footer}>
        Community 360 · Event Creation
      </footer>

    </div>
  );
}