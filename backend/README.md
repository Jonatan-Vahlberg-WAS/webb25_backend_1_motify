# Sqotify Backend

Express server with Mongoose, dotenv and CORS.

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

Set `MONGODB_URI` in `.env` (default: `mongodb://localhost:27017/sqotify`). Ensure MongoDB is running locally or use a cloud URI.

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

- `GET /api/artists` – List all artists
- `GET /api/songs` – List all songs (with artist populated)
