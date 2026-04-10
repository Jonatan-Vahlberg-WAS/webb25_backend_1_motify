# Motify Backend

Express server with Mongoose, dotenv and CORS. Motify = Mongoose + Spotify.

## How a request is handled

1. **`app.js`** applies global middleware: `cors`, `express.json`, then **`optionalAuth`** (see `middleware/auth.js`).
2. **`optionalAuth`** — If the client sends `Authorization: Bearer <accessToken>`, the JWT is verified and **`req.userId`** is set. No database lookup. Invalid or missing token: the request continues with **`req.userId` undefined** (no error yet).
3. **`requireAuth`** — Used only on routes that must be logged in. It expects **`req.userId`** from step 2, loads the user from MongoDB, sets **`req.user`**, or responds **401** if there is no valid user.

So: **public routes** often need no auth header; **protected routes** need a valid Bearer token so both middlewares can run in order. Implementing new protected handlers usually means adding **`requireAuth`** before your route logic.

**Token lifetimes** are defined in `utils/jwt.js` (`ACCESS_EXPIRY`, `REFRESH_EXPIRY`). When those values change, this README is not the source of truth—the code is.

## Setup

```bash
cd backend
npm install
```

## Environment

Copy the example env file and adjust as needed:

```bash
cp .env.example .env
```

Set `MONGODB_URI` and `JWT_SECRET` in `.env`. Ensure MongoDB is running locally or use a cloud URI. Use a strong random string for `JWT_SECRET` in production.

## Start

```bash
npm start
```

Seed the database (only if collections are empty):

```bash
npm run seed
```

Teardown (clear artists and songs) or reset (teardown + seed):

```bash
npm run teardown
npm run seed:reset
```

For development with auto-reload:

```bash
npm run dev
```

Server runs at `http://localhost:3000` (or the `PORT` in your `.env`).

## API

### Auth

- `POST /auth/register` – Register (body: `{ email, password }`) → `{ accessToken, refreshToken, user }`
- `POST /auth/login` – Login (body: `{ email, password }`) → `{ accessToken, refreshToken, user }`
- `POST /auth/refresh` – New tokens (body: `{ refreshToken }`) → `{ accessToken, refreshToken }`
- `GET /auth/me` – Current user (requires `Authorization: Bearer <accessToken>`). Uses **`requireAuth`**.

Use the refresh endpoint when the access token is rejected. Mutating data elsewhere generally requires the same `Authorization` header.

### Artists

- `GET /api/artists` – List all artists
- `GET /api/artists/:id` – One artist
- `POST`, `PUT`, `DELETE` – Require **`requireAuth`** (see `routes/artists.js`)

### Albums

- `GET /api/albums` – List albums (artist populated)
- `GET /api/albums/:id` – One album
- `POST`, `PUT`, `DELETE` – Require **`requireAuth`**

### Songs

- `GET /api/songs` – List songs (artist and album populated)
- `GET /api/songs/popular` – Top songs by playcount (registered **before** `GET /:id` so `popular` is not treated as an id—same pattern as playlists)
- `GET /api/songs/:id` – One song
- `POST`, `PUT`, `DELETE` – Require **`requireAuth`**

### Playlists

Playlists distinguish **public** lists (`user` is `null` on the document) from **owned** lists (a `User` reference). The exact rules are implemented in `routes/playlists.js`; read that file for filters and populations.

- `GET /api/playlists/latest` – Recent **public** playlists (limited count)
- `GET /api/playlists/my` – Current user’s playlists (**`requireAuth`**)
- `GET /api/playlists` – All **public** playlists
- `POST /api/playlists/my` – Create a playlist for the current user (**`requireAuth`**)
- `PUT /api/playlists/my/:id`, `DELETE /api/playlists/my/:id` – **`requireAuth`** + ownership middleware
- `GET /api/playlists/:id` – One **public** playlist by id

**Express route order:** paths with fixed segments (e.g. `latest`, `my`, `popular`) must be registered **before** a catch‑all like `/:id`. Otherwise a segment such as `my` could be parsed as an `:id`.

Extension work (sharing) is outlined at the repo level in [../docs/SHARE_SYSTEM.md](../docs/SHARE_SYSTEM.md). Look for `TODO` comments in `routes/playlists.js` and the stub middleware in `middleware/ownership.js`.

### Utils and scripts

- `utils/jwt.js` – Token creation and verification helpers used by auth routes and `optionalAuth`
- `scripts/seed.js` / `teardown.js` – Sample data and cleanup; useful to see how models relate

Reading order if you are new to the repo: `index.js` → `app.js` → `db.js` → `middleware/auth.js` → the route file for the feature you care about → its Mongoose model(s).
