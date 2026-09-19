# Event Registration System — Backend

Express.js + MongoDB (Mongoose) backend for managing events and user registrations.

## Setup

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev             # or: npm start
```

Requires a running MongoDB instance (local or Atlas connection string in `MONGO_URI`).

## Data Model

- **User**: name, email, password (hashed), role (`participant` | `organizer` | `admin`)
- **Event**: title, description, category, date, time, venue, capacity, registeredCount, organizer (ref User), status
- **Registration**: user (ref User), event (ref Event), status (`confirmed` | `cancelled`), registeredAt
  - Unique index on `(user, event)` so a user can't double-register
  - Registering/cancelling updates `Event.registeredCount` inside a transaction, so counts stay accurate

## Auth

JWT-based. Register or log in to get a token, then send it as:
```
Authorization: Bearer <token>
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account (`role`: participant or organizer) |
| POST | `/api/auth/login` | Public | Log in, get JWT |
| GET | `/api/auth/me` | Logged in | Get own profile |

## Events

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/events` | Public | List events (filters: `?category=&status=&search=`) |
| GET | `/api/events/:id` | Public | Event details |
| POST | `/api/events` | Organizer/Admin | Create event |
| PUT | `/api/events/:id` | Owning organizer/Admin | Update event |
| DELETE | `/api/events/:id` | Owning organizer/Admin | Delete event |

## Registrations

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/registrations` | Logged in | Register for an event (`{ "eventId": "..." }`) |
| GET | `/api/registrations/me` | Logged in | View my registrations |
| GET | `/api/registrations/event/:eventId` | Owning organizer/Admin | View who's registered for an event |
| DELETE | `/api/registrations/:id` | Registration owner | Cancel a registration |

## Notes / Next Steps

- Capacity is enforced server-side: registration fails with `400` once `registeredCount >= capacity`.
- Cancelling a registration decrements `registeredCount` so the seat reopens.
- The `admin` role isn't assignable at signup — promote a user manually in the database, or add an admin-only endpoint for that.
- For production: add rate limiting, input validation (e.g. `express-validator`), and refresh tokens.
