import { Router } from "express";
import Playlist from "../models/Playlist.js";
import { requireAuth } from "../middleware/auth.js";
import {
  isPlaylistOwner,
  isPlaylistSharedWithUser,
} from "../middleware/ownership.js";
import User from "../models/User.js";
import Share from "../models/Share.js";

const router = Router();

router.get("/latest", async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: null })
      .sort({ _id: -1 })
      .limit(5)
      .populate("songs", "title");
    res.json(playlists);
  } catch (err) {
    console.error("Latest playlists failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Current user’s playlists (requires Bearer token; optionalAuth + requireAuth).
 * Registered before GET /:id so "my" is not captured as an :id.
 */
router.get("/my", requireAuth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user._id })
      .populate("songs", "title artist durationSeconds")
      .populate("user", "email");
    res.json(playlists);
  } catch (err) {
    console.error("My playlists failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//? getting all playlists shared with "me" /playlists/shared-with-me
router.get("/shared-with-me", requireAuth, async (req, res) => {
  try {
    const shares = await Share.find({ sharedWith: req.user._id }).populate({
      path: "playlist",
      populate: [
        {
          path: "songs",
          populate: { path: "artist", select: "name" },
        },
        { path: "user", select: "email" },
      ],
    });

    const playlists = shares
      .filter((s) => s.playlist !== null)
      .map((s) => s.playlist);

    res.json(playlists);
  } catch (error) {
    console.error("Shared-with-me failed:", error.message);
    res.status(500).json({ error: "Could not fetch shared playlists" });
  }
});

router.get(
  "/shared-with-me/:id",
  requireAuth,
  isPlaylistSharedWithUser,
  async (req, res) => {
    try {
      const playlist = await Playlist.findById(req.params.id)
        .populate({
          path: "songs",
          select: "title artist album durationSeconds",
          populate: [
            { path: "artist", select: "name" },
            { path: "album", select: "title" },
          ],
        })
        .populate("user", "email");

      res.json(playlist);
    } catch (error) {
      console.error("Shared-with-me failed:", error.message);
      res.status(500).json({ error: "Could not fetch shared playlist" });
    }
  },
);

/**
 * Get all playlists that are publicly accessible
 */
router.get("/", async (req, res) => {
  try {
    const playlists = await Playlist.find({
      user: null,
    })
      .populate("songs", "title artist durationSeconds")
      .populate("user", "email");
    res.json(playlists);
  } catch (err) {
    console.error("Playlists list failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/my", requireAuth, async (req, res) => {
  try {
    const body = {
      name: req.body.name,
      description: req.body.description,
      songs: req.body.songs || [],
      user: req.body.user ?? req.user._id,
    };
    const playlist = await Playlist.create(body);
    await playlist.populate("songs", "title artist durationSeconds");
    await playlist.populate("user", "email");
    res.status(201).json(playlist);
  } catch (err) {
    console.error("Create playlist failed:", err.message);
    res.status(400).json({ error: err.message });
  }
});

//TODO: add routes for
//? sharing a playlist with a user based on their email /playlists/my/:id/share
router.post("/my/:id/share", requireAuth, isPlaylistOwner, async (req, res) => {
  const email = req.body.email;

  if (!email) {
    console.error("Email is required to share a playlist");
    return res
      .status(400)
      .json({ error: "Email is required to share a playlist" });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      console.error("No user found with that email address");
      return res
        .status(404)
        .json({ error: "No user found with that email address" });
    }

    if (user._id.equals(req.user._id)) {
      console.error("You cannot share a playlist with yourself");
      return res
        .status(400)
        .json({ error: "You cannot share a playlist with yourself" });
    }

    const share = await Share.create({
      playlist: req.params.id,
      sharedWith: user._id,
    });

    res.status(201).json({
      message: "Playlist shared successfully",
      sharedWith: user.email,
    });
  } catch (error) {
    if (error.code === 11000) {
      console.error("This playlist is already shared with this user");
      return res
        .status(400)
        .json({ error: "This playlist is already shared with this user" });
    }

    console.error("Sharing failed:", error.message);
    res.status(500).json({ error: "Could not share playlist" });
  }
});

router.put("/my/:id", requireAuth, isPlaylistOwner, async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("songs", "title artist durationSeconds")
      .populate("user", "email");
    if (!playlist) {
      console.error("Update playlist: Playlist not found");
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.json(playlist);
  } catch (err) {
    console.error("Update playlist failed:", err.message);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/my/:id", requireAuth, isPlaylistOwner, async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);

    if (!playlist) {
      console.error("Delete playlist: Playlist not found");
      return res.status(404).json({ error: "Playlist not found" });
    }

    await Share.deleteMany({ playlist: req.params.id });

    res.status(204).send();
  } catch (err) {
    console.error("Delete playlist failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get a publicly accessible playlist by ID (user must be null on the document).
 * Must be registered after /my so /my is not interpreted as an id.
 */
router.get("/:id", async (req, res) => {
  if (
    req.params.id.startsWith("shared-with-") ||
    req.params.id.startsWith("my/")
  ) {
    return res
      .status(404)
      .json({ error: "Endpoint not implemented correctly" });
  }
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: null,
    }).populate({
      path: "songs",
      populate: { path: "artist", select: "name" },
    });
    if (!playlist) {
      console.error("Playlist by ID: Playlist not found");
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.json(playlist);
  } catch (err) {
    console.error("Playlist by ID failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
