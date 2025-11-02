# Smart Event Booking System

A full-stack MERN-style application (React + Node) for event discovery, booking and management with real-time seat availability.

This repository contains a production-ready base and a clear roadmap for future enhancements such as payments, QR-ticket generation, dynamic pricing, advanced seat-locking, analytics, and scalable WebSocket infrastructure.

---

## Live Demo

[https://smart-event-booking-system-eta.vercel.app/](https://smart-event-booking-system-eta.vercel.app/)

---

## Features (implemented)

### User

* Browse upcoming events with search and filters (location / date)
* Real-time seat availability updates via Socket.IO
* Book tickets with instant confirmation
* Booking confirmation returned to user (JSON response + cookie JWT)
* Event details with description, date/time, location, image

### Admin

* Event management: Create / Read / Update / Delete events (admin-only)
* Monitor bookings and available seats
* Admin authentication and protected admin routes

### Tech stack (current)

* Backend: Node.js, Express, MySQL, Socket.IO, JWT
* Frontend: React, Tailwind CSS, Framer Motion, Axios, React Router
* Development tools: Vite (frontend), nodemon (backend)

---

## Project structure

```
smart-event-booking-system/
├── backend/
│   ├── configuration/      # DB connection, env config
│   ├── controllers/        # Route controllers (auth, events, bookings)
│   ├── middleware/         # auth, admin checks, error handler
│   ├── routes/             # API routes
│   ├── event_booking.sql   # DB schema + indexes
│   └── socket.js           # Socket.IO setup
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── services/       # api client, auth service
        ├── context/        # socket & auth providers
        └── assets/
```

---

## Quick start

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill values
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # fill values (VITE_API_URL)
npm run dev
```

---

## Environment variables (examples)

Create `.env` in `backend/`:

```
PORT=5000
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DB_PORT=3306
JWT_SECRET=your_jwt_secret
ADMIN_SECRET=some_admin_secret  # for quick admin-only routes (or use role-based JWT)
```

Create `.env` in `frontend/`:

```
VITE_API_URL=http://localhost:5000
```

---

## Database

Import the schema:

```bash
mysql -u username -p database_name < backend/event_booking.sql
```

Key tables:

* `users` (id, name, email, password_hash, contact_number, role, token, created_at)
* `events` (id, title, description, location, date, total_seats, available_seats, price, img, created_at)
* `bookings` (id, event_id, user_id (optional), name, email, mobile, quantity, total_amount, booking_date, status)

Note: `events` and `bookings` use InnoDB and row-level locking for transactional safe decrements on `available_seats`.

---

## API endpoints (summary)

```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/events
GET    /api/events/:id
POST   /api/events            (admin)
PUT    /api/events/:id        (admin)
DELETE /api/events/:id        (admin)
POST   /api/bookings
GET    /api/bookings          (admin or user-specific)
```

Authentication: JWT in `Authorization: Bearer <token>` header or httpOnly cookie.

Socket events:

* Client joins room: `socket.emit('join_event', { event_id })`
* Server emits on change: `seat_update` and `seat_update_global`

---

## Documentation

- Backend API documentation: See  [backend/README.md](https://github.com/karangupta982/smart-event-booking-system/tree/main/backend)
- Frontend documentation: See [frontend/README.md](https://github.com/karangupta982/smart-event-booking-system/tree/main/frontend)

---

## Future Implementations — roadmap & design

The sections below describe recommended future features, design notes, libraries, and integration ideas. They are written so you or contributors can implement them progressively.

### 1. Payment gateway integration

**Purpose:** Accept payments for paid events and mark bookings as paid.

**Recommended providers:**

* Stripe (recommended): good docs, test modes, webhooks
* PayPal (alternative)

**Design notes:**

* Keep payments off the critical booking transaction. Typical flow:

  1. Create a provisional booking with status `pending` and lock seats (see seat locking below).
  2. Create a payment intent/session with Stripe including `amount`, `currency`, and `metadata` (booking id).
  3. Confirm payment on the client (Stripe Checkout or Payment Element).
  4. Webhook endpoint `/api/payments/webhook` to capture payment events and update booking status to `confirmed` or `failed`.
  5. On success: commit seat decrement (if not already committed) and emit `seat_update`.

**Important:** Use server-side webhooks (secret verification) and never trust client callbacks.

**Env variables for Stripe:**

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Libraries:**

* `stripe` (npm)
* Use idempotency keys for safe retries.

---

### 2. Real QR codes (scannable tickets)

**Purpose:** Provide users a downloadable scannable QR ticket that can be validated by staff.

**Recommended approach:**

* Generate a signed token (JWT or HMAC) per booking containing `booking_id`, `event_id`, `user_id` and short expiry or unique nonce.
* Generate QR code image (SVG/PNG) from token using libraries like `qrcode` or `qrcode.react` on frontend.
* When scanning, the scanning device resolves the token and calls a backend endpoint `/api/ticket/validate?token=<token>` to check:

  * booking exists, matches event, status confirmed, not used/expired.
  * Optional: mark ticket as used (single-use).

**Libraries:**

* Backend: `qrcode` (for generating server-side if needed)
* Frontend: `qrcode.react` or generate byte URL from token and render
* For validation, store a `ticket_scanned_at` timestamp when validated to prevent re-use.

**Security:** Sign ticket tokens with server secret, verify signature on validation.

---

### 3. Dynamic pricing (pricing strategies)

**Goal:** Support price changes by rules (early-bird, last-minute surge, demand-based).

**Suggested models:**

* **Static tiers:** store price tiers (early bird until date `X`, standard, late).
* **Capacity-based:** increase price by X% after 70% sold.
* **Time-based:** discount until date, then normal price.
* **Promo codes:** add `coupons` table with discount type/amount/expiry.

**Schema additions:**

* `ticket_pricing` table or fields on `events`:

  * `base_price`, `early_bird_price`, `early_bird_end`, `peak_multiplier_threshold`, `peak_multiplier_value`
* Calculate price server-side at booking time using event state to guarantee consistency.

**Important:** Record final `total_amount` on booking to prevent later disputes.

---

### 4. Robust seat locking (real-time lock + eventual release)

**Problem:** Prevent overselling when multiple users are booking simultaneously.

**Recommended mechanism:**

* Two-step booking flow:

  1. **Lock seats**: create a short-lived lock entry like `seat_locks` with `event_id`, `user_id`, `quantity`, `locked_at`, `expires_at`.
  2. Decrement `available_seats` only after payment confirmation (or optionally decrement on lock and restore on expiry).
  3. Use `SELECT ... FOR UPDATE` on `events` rows (transaction) to safely create locks and update availability.
* Implement a background job (cron) to release expired locks and restore seats.

**Scaling note:** Use Redis for distributed lock store if you scale across multiple server instances.

---

### 5. WebSocket scaling & reliability

**Problem:** Socket.IO single instance is fine for development, but for production you must scale and share messages across instances.

**Recommended approach:**

* Use Socket.IO with Redis adapter (`socket.io-redis`) or Redis Pub/Sub to propagate events between server instances.
* Deploy backend with a provider that supports WebSockets or use a dedicated socket host.
* If using serverless functions, consider managed socket providers (e.g., Pusher, Ably) or deploy long-running Node servers.

**Design notes:**

* Emit to event-specific rooms: `event_<id>`
* Key events: `seat_update`, `booking_confirmed`, `booking_cancelled`

---

### 6. Analytics & admin insights

**Ideas:**

* Bookings per event (daily/weekly)
* Conversion funnel (views → bookings)
* Revenue by event
* Heatmap of popular locations

**Tech:** store basic analytics events in DB and aggregate nightly, or stream to analytics (Google Analytics, Plausible) and backend metrics (Prometheus/Grafana).

---

### 7. Testing, CI/CD & deployment

**CI/CD pipeline (suggested):**

* GitHub Actions:

  * Run lint, unit tests, integration tests on PRs
  * On merge to `main`, build frontend and backend artifacts, run migrations, deploy to hosts

**Deployment options:**

* Frontend: Vercel / Netlify (static build)
* Backend: Render / Heroku / DigitalOcean App Platform / AWS (EC2/Elastic Beanstalk)
* Database: PlanetScale, Amazon RDS, ClearDB, or your existing FreeSQLDatabase (for production use managed DB)
* For WebSockets, Render/Heroku support long-running processes; ensure sticky sessions or Redis adapter.

**Sample GitHub Actions (outline):**

* `lint` job: `eslint`, `prettier`
* `test` job: run backend unit tests (Jest) and frontend tests (Vitest)
* `deploy` job: build and push to target platform (only on main branch)

---

### 8. Security considerations

* Use HTTPS in production. Enforce secure cookies, `SameSite` settings, `httpOnly`.
* Do not store raw JWTs in localStorage for XSS-prone UIs; prefer httpOnly cookies for session security.
* For payments, comply with PCI requirements (Stripe handles most compliance if you use their elements and Checkout).
* Rate-limit critical endpoints (login, booking) to avoid abuse.
* Validate and sanitize all inputs (avoid SQL injection).
* Use prepared statements / parameterized queries (mysql2/promise does).

---

### 9. Monitoring & logging

* Use centralized logging (Papertrail, LogDNA, or provider logs).
* Application metrics: CPU, memory, request latency.
* Error tracking: Sentry or similar to capture runtime errors.

---

## Implementation examples & snippets

### Stripe payment intent creation (Node)

```js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/payments/create-intent', async (req, res) => {
  const { amount, currency = 'inr', bookingId } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata: { bookingId },
  });
  res.json({ clientSecret: paymentIntent.client_secret });
});
```

### QR token generation (booking)

```js
const jwt = require('jsonwebtoken');
function makeTicketToken(booking) {
  
  return jwt.sign(
    { bookingId: booking.id, eventId: booking.event_id, nonce: booking.created_at },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } 
  );
}
```

### Socket room join from client (React)

```js
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_API_URL);

useEffect(() => {
  socket.emit('join_event', { event_id: eventId });
  socket.on('seat_update', data => setAvailableSeats(data.available_seats));
  return () => {
    socket.emit('leave_event', { event_id: eventId });
    socket.off('seat_update');
  };
}, [eventId]);
```

---

## Roadmap (milestones)

1. Payment integration (Stripe) with webhook handling and finalizing bookings.
2. QR ticket generation + validation endpoint.
3. Dynamic pricing and coupons.
4. Seat locking with Redis-backed distributed locks.
5. WebSocket scaling with Redis adapter.
6. CI/CD pipelines and production deployments.
7. PWA support & mobile optimizations.
8. Analytics & Admin dashboards with charts.

---

## Contribution

1. Fork the repository
2. Create a branch (`feature/your-feature`)
3. Commit changes with clear messages
4. Open a Pull Request describing the change and testing steps

Please run tests and linters before submitting PRs.

---

## License

MIT License