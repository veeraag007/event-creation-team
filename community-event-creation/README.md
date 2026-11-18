# CommUnity · Event Creation

Standalone project split out of the CommUnity monolith. Includes login, the Event Creation app, the shared package and the events API.

## Run
```bash
npm install
npm run dev          # API (:4000) + Event Creation (:3001)
```
macOS: double-click `start.command` instead (installs, starts, opens the browser).
Open http://localhost:3001.

Docker: `docker compose up --build` → http://localhost:8081

## Layout
- `apps/event-creation` – this app (own login via `packages/shared/src/auth`)
- `packages/shared` – types, RBAC, shell, UI kit, seat-map components, event data, API client
- `services/api` – events API (JSON-file store). Point both micro-apps at the same API to share events with the **Ticket Booking** project.

Set `VITE_API_URL` (default `http://localhost:4000`) if the API runs elsewhere.
If the API is not running the app falls back to sample data (a banner says so).
