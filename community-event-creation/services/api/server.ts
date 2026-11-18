/**
 * Minimal events service shared by the Event Creation and Ticket Booking apps.
 * Persists to a JSON file (seeded from the sample data) – swap for a real
 * database/service when moving beyond the prototype.
 */
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INITIAL_EVENTS } from '../../packages/shared/src/data/eventData';
import type { CommunityEvent } from '../../packages/shared/src/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR ?? path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'events.json');
const PORT = Number(process.env.PORT ?? 4000);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ??
  'http://localhost:3001,http://localhost:3002,http://localhost:8081,http://localhost:8082').split(',');

function load(): CommunityEvent[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return structuredClone(INITIAL_EVENTS);
  }
}

function persist(events: CommunityEvent[]) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
}

let events = load();
if (!fs.existsSync(DATA_FILE)) persist(events);

const app = express();
app.use(express.json({ limit: '5mb' }));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true, events: events.length }));

app.get('/api/events', (_req, res) => res.json(events));

app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  return event ? res.json(event) : res.status(404).json({ error: 'Event not found' });
});

// Create or replace an event (idempotent upsert, used by both apps)
app.put('/api/events/:id', (req, res) => {
  const body = req.body as CommunityEvent;
  if (!body || typeof body !== 'object' || body.id !== req.params.id || typeof body.name !== 'string') {
    return res.status(400).json({ error: 'Body must be an event whose id matches the URL' });
  }
  const exists = events.some(e => e.id === body.id);
  events = exists ? events.map(e => (e.id === body.id ? body : e)) : [body, ...events];
  persist(events);
  return res.status(exists ? 200 : 201).json(body);
});

app.delete('/api/events/:id', (req, res) => {
  const before = events.length;
  events = events.filter(e => e.id !== req.params.id);
  if (events.length === before) return res.status(404).json({ error: 'Event not found' });
  persist(events);
  return res.sendStatus(204);
});

app.listen(PORT, () => console.log(`Events API listening on http://localhost:${PORT}`));
