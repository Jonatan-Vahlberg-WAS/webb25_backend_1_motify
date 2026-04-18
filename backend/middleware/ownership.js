import Playlist from "../models/Playlist.js";

export const isPlaylistOwner = async (req, res, next) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    console.error("Ownership: Playlist not found");
    return res.status(404).json({ error: "Playlist not found" });
  }
  if (!playlist.user || !playlist.user.equals(req.user._id)) {
    console.error("Ownership: Not authorized to modify this playlist");
    return res
      .status(403)
      .json({ error: "Not authorized to modify this playlist" });
  }
  req.playlist = playlist;
  next();
};

/**
 * Placeholder for extension work (playlist sharing). Not wired to any route yet.
 * Implement authorization for “shared with me” access when you add those routes;
 * until then, leaving this empty is intentional—see docs/SHARE_SYSTEM.md.
 */
export const isPlaylistSharedWithUser = async (req, res, next) => {
  // TODO: Implement this (student / course extension)
  try {
    const share = await Share.findOne({
      playlist: req.params.id,
      sharedWith: req.user._id,
    });

    if (!share) {
      console.error("Access: Playlist not shared with user");
      return res.status(403).json({ error: "You do not have access to this shared playlist" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Could not share check' });
  }
};
