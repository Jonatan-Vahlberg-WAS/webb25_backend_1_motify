# Motify

Motify = Mongoose + Spotify. A music API backend built with Express and MongoDB.

## Project structure

```
├── backend/          # Express + Mongoose API
└── sql_unused/       # Legacy SQL schemas and data
```

## Quick start

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Run `npm run seed` to populate with demo data (only when collections are empty). See [backend/README.md](backend/README.md) for full setup and API details.
