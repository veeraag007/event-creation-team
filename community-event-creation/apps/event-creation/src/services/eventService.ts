
const API_URL = "http://localhost:4000/api";

export async function getEvent(id: string) {
  const response = await fetch(`${API_URL}/events/${id}`);

  if (!response.ok) {
    throw new Error("Unable to fetch event");
  }

  return response.json();
}

export async function createEvent(eventData: unknown) {
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Unable to create event");
  }

  return response.json();
}

export async function updateEvent(
  id: string,
  eventData: unknown
) {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Unable to update event");
  }

  return response.json();
}
