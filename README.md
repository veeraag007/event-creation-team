# Community 360 – Event Creation

Raagavan S — Event Details, User Account & My Events (Event Creation Team)

This branch includes a redesigned animated landing page, admin and attendee email-verified registration, login and logout, attendee profile/password updates and Member 3's published event discovery. Organization onboarding and the organization's final dashboard, password recovery, ticketing and real My Events history are still pending.

## Local setup (Windows)

Requirements: Java 21 JDK, Node.js compatible with Next.js 16, PostgreSQL, npm. Stop old servers before restarting.

Create two databases in pgAdmin if they do not already exist: `community360` for accounts and `community_events` for events. The account backend creates its tables and admin ID sequence automatically. The uploaded event service applies its original Flyway V1–V6 migrations. If a team database already exists with those migrations, use its name in the JDBC URL. Never delete existing tables or blindly baseline Flyway.

### Terminal 1 — account backend (8080)

Open the repository's `backend` folder in IntelliJ or PowerShell:

```powershell
$env:DB_USER = "postgres"
$env:DB_PASSWORD = (Get-Credential -UserName $env:DB_USER -Message "PostgreSQL password").GetNetworkCredential().Password
$env:MAIL_USERNAME = Read-Host "Gmail sender address"
$env:MAIL_PASSWORD = (Get-Credential -UserName $env:MAIL_USERNAME -Message "Gmail app password").GetNetworkCredential().Password
$env:MAIL_PASSWORD = $env:MAIL_PASSWORD.Replace(" ", "")
.\mvnw.cmd spring-boot:run
```

Use a dedicated Gmail sender with two-step verification and an app password if the Google account supports app passwords. Never use your regular Gmail password, share credentials in chat, or commit credentials. Any recipient email address the user controls can be verified. A code expires after 10 minutes, allows five incorrect attempts, and has a 60-second resend cooldown (up to three sends per address per 10-minute window). New accounts are not saved before verification. Pre-existing accounts verify their registered email the first time they log in; inaccessible addresses cannot be verified. Missing or failed SMTP configuration prevents account creation rather than bypassing email verification.

### Terminal 2 — event discovery API (8081)

Open `events-backend` in a separate terminal:

```powershell
$env:EVENT_DB_USER = "postgres"
$env:EVENT_DB_PASSWORD = (Get-Credential -UserName $env:EVENT_DB_USER -Message "PostgreSQL password").GetNetworkCredential().Password
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/community_events"
.\mvnw.cmd spring-boot:run
```

For an existing compatible event database, change the final database name in the URL. Member 3's entities and database migrations are retained. Its API uses page-0-based pagination with `data` array and `pagination` metadata. The discovery frontend uses the actual API with search suggestions, category, type, date, location, price and status filters, sorting and paging. No sample events are automatically inserted.

### Terminal 3 — frontend (3001)

Open the repository's `frontend` folder in VS Code:

```powershell
npm.cmd ci
npm.cmd run dev -- --port 3001
```

Visit http://localhost:3001 (use localhost consistently). Admin and attendee login buttons lead to their respective signup or login flows. The attendee is redirected to `/explore`; the admin goes to a protected temporary handoff screen. The attendee can navigate to `/profile`, `/my-events` and `/events/[id]`. My Events remains a placeholder until real bookings are integrated.

API URLs can be overridden through `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_EVENTS_API_URL` (update backend CORS if the frontend origin changes). The stale Next.js SQLite registration endpoint was removed. Accounts use Spring Boot/PostgreSQL exclusively.

## Docker presentation

Install/start Docker Desktop. From the repository root, copy `.env.example` to `.env`, fill in your database password and Gmail sender credentials locally, and run `docker compose up --build`. Open http://localhost:3001. Stop older services on ports 3001, 8080 and 8081 first. Docker creates **new isolated persistent databases**, not copies of your local pgAdmin databases. Run `docker compose down` to stop the stack without deleting data volumes. The events database will remain empty until organizers publish events into it.

## Verification checklist

- Register a test admin and attendee using addresses you control. Confirm code delivery, reject incorrect/expired codes, and check no account is stored before verification.
- Verify correct codes, confirm rows in pgAdmin, reject duplicate registration and wrong password.
- Log in with verified email or admin Community ID. Confirm correct destination, sign out, and confirm protected pages require login.
- Confirm older accounts verify on first login; test attendee profile update and password change.
- Publish a real event in the team event database and check discovery, filters, pagination and event details.
- Frontend checks: `npm test` and `npm run lint`. OTP tests: `./mvnw -Dtest=EmailVerificationServiceTests test` in `backend`.

Email challenges and throttling are process-local for this single-instance internship demo; restarting the account API invalidates pending codes. Production deployment needs distributed throttling, persistent challenges, HTTPS-only cookies, additional authentication testing and organization authorization controls.
