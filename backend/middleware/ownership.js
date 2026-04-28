import Playlist from "../models/Playlist.js";
import Share from "../models/Share.js";

export const isPlaylistOwner = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      console.error("Ownership: Playlist not found");
      return res.status(404).json({ error: "Playlist not found" });
    }

    if (!playlist.user || !playlist.user.equals(req.user._id)) {
      console.error(`Unauthorized access attempt by user ${req.user._id}`);
      return res.status(403).json({ error: "You do not have permission to modify this playlist" });
    }

    req.playlist = playlist;
    next();
  } catch (err) {
    console.error("isPlaylistOwner middleware error:", err.message);
    res.status(500).json({ error: "Authorization process failed" });
  }
};

/**
 * Placeholder for extension work (playlist sharing). Not wired to any route yet.
 * Implement authorization for “shared with me” access when you add those routes;
 * until then, leaving this empty is intentional—see docs/SHARE_SYSTEM.md.
 */
export const isPlaylistSharedWithUser = async (req, res, next) => {
  try {
    const shared = await Share.findOne({
      playlist: req.params.id,
      sharedWith: req.user._id,
    });

    if (!shared) {
      console.error(`Access denied: Playlist ${req.params.id} not shared with user ${req.user._id}`);
      return res.status(403).json({ error: "You do not have access to this shared playlist" });
    }

    next();
  } catch (error) {
    console.error("isPlaylistSharedWithUser middleware error:", error.message);
    res.status(500).json({ error: "Access verification failed" });
  }
};
