//temporary admin dashboard page to test the Spring Boot API connection and fetch admin details

'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAdmin() {
      try {
        const response = await fetch(
          'http://localhost:8080/api/admin/me',
          {
            credentials: 'include',
            cache: 'no-store',
          }
        );

        if (response.status === 401) {
          window.location.replace('/admin-login');
          return;
        }

        if (!response.ok) {
          throw new Error('Could not load admin details.');
        }

        setAdmin(await response.json());
      } catch {
        setError('Could not connect to Spring Boot.');
      }
    }

    loadAdmin();
  }, []);

  if (error) return <p>{error}</p>;
  if (!admin) return <p>Loading workspace...</p>;

  return (
    <main style={{ padding: 40 }}>
      <h1>Community 360 – Admin Dashboard</h1>
      <h2>Welcome, {admin.fullName}</h2>
      <p>Organization: {admin.organization}</p>
      <p>Community ID: {admin.communityId}</p>
      <p>Email: {admin.email}</p>
    </main>
  );
}