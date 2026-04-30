import Playlist from '../models/Playlist.js';

export const isPlaylistOwner = async (req, res, next) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    console.error('Ownership: Playlist not found');
    return res.status(404).json({ error: 'Playlist not found' });
  }
  if (!playlist.user || !playlist.user.equals(req.user._id)) {
    console.error('Ownership: Not authorized to modify this playlist');
    return res.status(403).json({ error: 'Not authorized to modify this playlist' });
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
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.user && playlist.user.equals(req.user._id)) {
      req.playlist = playlist;
      return next();
    }

    const isShared = playlist.sharedWith.some(id =>
      id.equals(req.user._id)
    );

    if (!isShared) {
      return res.status(403).json({ error: 'Not authorized to view this playlist' });
    }

    req.playlist = playlist;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};