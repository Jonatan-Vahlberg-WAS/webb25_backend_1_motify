# 🎵 Motify

**Motify** is a full-stack music application where users can discover music and manage personal collections. This version is a **fork** that extends the original project with a **Playlist Sharing System** and improved code architecture.

---

### ✨ Features

* **Explore:** Browse popular songs and public playlists without needing an account.
* **Personal Accounts:** Register and log in to create and manage your own private playlists.
* **Secure Auth:** Full JWT-based authentication flow with access and refresh tokens.
* **Playlist Sharing (New):** Share your curated playlists with other users via email.
* **Structured backend with controllers:** Refactored backend using a `playlistController` for better readability and maintainability.

---

### 🤝 Playlist Sharing System

This fork focuses on collaboration. The logic is built around granular access control:

* **Grant Access:** A playlist owner can share any of their playlists with another registered user by email via `POST /api/playlists/my/:id/share`.
* **Read Access:** Logged-in users can view all playlists shared with them via `GET /api/playlists/shared-with-me`.
* **Write Protection:** Receivers have **Read-Only** access. They cannot edit details, add/remove songs, or delete the playlist. This is strictly enforced via `middleware/ownership.js`.

---

### 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Context API (Auth state) |
| **Backend** | Node.js, Express, Mongoose, JWT (Access + Refresh tokens) |
| **Database** | MongoDB |

---

### 📂 Project Structure

```text
motify/
├── frontend/   # React + Vite (Client)
└── backend/    # Express + Mongoose (API with Controller-based routing)
```

---

### 🚀 Getting Started

#### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # Set MONGODB_URI and JWT_SECRET
npm run seed           # Seed sample data (only if collections are empty)
npm run dev            # Starts on http://localhost:3000
```

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev            # Starts on http://localhost:5173
```

---

### 📡 API Overview

| Method | Route | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/auth/register` | — | Register |
| `POST` | `/auth/login` | — | Login |
| `POST` | `/auth/refresh` | — | Refresh tokens |
| `GET` | `/auth/me` | ✅ | Current user |
| `GET` | `/api/songs/popular` | — | Top songs by playcount |
| `GET` | `/api/playlists` | — | All public playlists |
| `GET` | `/api/playlists/latest` | — | 5 most recent public playlists |
| `GET` | `/api/playlists/my` | ✅ | Your playlists |
| `POST` | `/api/playlists/my` | ✅ | Create playlist |
| `PUT` | `/api/playlists/my/:id` | ✅ owner | Update playlist |
| `DELETE` | `/api/playlists/my/:id` | ✅ owner | Delete playlist |
| `POST` | `/api/playlists/my/:id/share` | ✅ owner | Share with a user by email |
| `GET` | `/api/playlists/shared-with-me` | ✅ | Playlists shared with you |
