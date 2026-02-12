# Motify Backend

Express server with Mongoose, dotenv and CORS. Motify = Mongoose + Spotify.

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

For development with auto-reload:

```bash
npm run dev
```

Server runs at `http://localhost:3000` (or the `PORT` in your `.env`).

## API

### Auth
- `POST /auth/register` – Register (body: `{ email, password }`) → `{ accessToken, refreshToken, user }`
- `POST /auth/login` – Login (body: `{ email, password }`) → `{ accessToken, refreshToken, user }`
- `POST /auth/refresh` – Get new tokens (body: `{ refreshToken }`) → `{ accessToken, refreshToken }`
- `GET /auth/me` – Current user (requires `Authorization: Bearer <accessToken>`)

Access tokens expire in 15 min. Use the refresh endpoint with the refresh token to get new tokens. Protect routes with `requireAuth` from `middleware/auth.js`.

### Artists & Songs
- `GET /api/artists` – List all artists
- `GET /api/songs` – List all songs (with artist populated)
