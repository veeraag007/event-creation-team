// Sends attendee requests to Spring Boot and keeps the session cookie on each request.
const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function attendeeRequest(path, method = 'GET', data) {
  const response = await fetch(`${base}/api/attendee${path}`, {
    method,
    credentials: 'include',
    cache: 'no-store',
    ...(data !== undefined ? {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    } : {}),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error || (response.status === 400
      ? 'Please check your details.' : 'Request failed.'));
    error.status = response.status;
    throw error;
  }
  return result;
}
