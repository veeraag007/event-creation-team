

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const [communityId, setCommunityId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        'http://localhost:8080/api/admin/login',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ communityId, password }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || 'Login failed.');
        return;
      }

      router.push('/admin/dashboard');

    } catch {
      setMessage('Unable to connect to the backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <p className="brand">Community 360 – Event Creation</p>

        <h1>Admin Login</h1>
        <p>Sign in to your organization workspace.</p>

        <label>
          Community 360 ID or Email
          <input
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            placeholder="Enter your C360 ID or email"
            autoComplete="username"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </label>

        <button disabled={loading} type="submit">
          {loading ? 'Signing in...' : 'Login →'}
        </button>

        <p role="status" className="message">{message}</p>

        <a href="/admin-registration">
          Create an admin account
        </a>
      </form>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #080d1c;
          color: #f5f6ff;
          padding: 24px;
        }

        .login-card {
          width: min(440px, 100%);
          display: grid;
          gap: 20px;
          background: #11192c;
          border: 1px solid #293654;
          padding: 32px;
          border-radius: 20px;
        }

        .brand { color: #a99aff; }

        h1 { font-size: 32px; }

        p { color: #aebbd5; }

        label {
          display: grid;
          gap: 8px;
        }

        input {
          padding: 14px;
          width: 100%;
          color: white;
          background: #080d1c;
          border: 1px solid #43516c;
          border-radius: 10px;
        }

        button {
          background: #5942e7;
          color: white;
          padding: 14px;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
        }

        button:disabled { opacity: .6; }

        .message { color: #ffadb8; }
      `}</style>
    </main>
  );
}