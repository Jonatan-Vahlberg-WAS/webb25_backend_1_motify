# Share system (implementation task)

This document frames the **playlist sharing** extension. It does not spell out a full design—you are expected to explore the codebase and make your own modelling and API decisions.

## Goals (what “done” might look like)

- An owner can grant another user access to a playlist they control (how you identify “the other user” is up to you).
- A logged-in user can see or use playlists that were shared with them, separately from playlists they own and from public playlists.

## Where to start (discovery, not a checklist)

- Read `backend/models/Playlist.js` and decide whether sharing belongs on that schema, a separate collection, or another approach.
- Follow `optionalAuth` / `requireAuth` in `backend/middleware/auth.js` and see how protected routes attach `req.user`.
- Open `backend/routes/playlists.js` and find the **`TODO`** comments: they sketch **ideas** the course may expect you to align with; naming and payloads are still your responsibility.
- `backend/middleware/ownership.js` contains a **stub** for shared-access checks. It is intentionally incomplete until you implement sharing.

## Frontend

Inspect how the Playlists UI loads data (network tab or source under `frontend/src/components/`). The client may already call an endpoint that does not exist yet: your backend should satisfy that contract **or** you document why the frontend must change (coordinate with your course rules).

## References

- [Backend README](../backend/README.md) — request flow, route ordering, and API surface.
