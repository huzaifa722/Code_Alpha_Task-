# Campus Events — Frontend

React + Vite frontend for the Event Registration System, connecting to the Express/MongoDB backend.

## Setup

```bash
npm install
cp .env.example .env   # VITE_API_URL=/api works out of the box with the dev proxy
npm run dev
```

Opens on `http://localhost:5173`. Requests to `/api/*` are proxied to `http://localhost:5000` (see `vite.config.js`) — start the backend first.

If you deploy the backend elsewhere, set `VITE_API_URL` in `.env` to the full backend URL (e.g. `https://your-api.onrender.com/api`) and remove/ignore the dev proxy.

## What's here

- **Auth**: `context/AuthContext.jsx` holds the JWT (in localStorage) and current user; wraps login/register/logout and fetches `/auth/me` on load.
- **Pages**:
  - `Events` — browse/search/filter events (ticket-stub cards)
  - `EventDetails` — full details + register button (disabled once full)
  - `MyRegistrations` — view and cancel your own registrations
  - `Login` / `Register`
- **`ProtectedRoute`** guards `/my-registrations`, redirecting to `/login` if not authenticated.
- **`api.js`** is the single place that talks to the backend — every request goes through it.

## Notes

- Organizer-only screens (create/edit event, view an event's registration list) aren't built yet — the backend already supports them (`POST/PUT/DELETE /api/events`, `GET /api/registrations/event/:eventId`); wiring up an organizer dashboard would be the natural next step.
- Styling is plain CSS (`src/styles.css`) — no framework — using a ticket-stub motif for event cards.
