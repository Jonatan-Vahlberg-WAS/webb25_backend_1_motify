import Playlist from '../models/Playlist.js';

export const isPlaylistOwner = async (req, res, next) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    console.error('Ownership: Playlist not found');
    return res.status(404).json({ error: 'Playlist not found' });
  }
  if (!playlist.user || playlist.user.toString() !== req.user._id.toString()){
    console.error('Ownership: Not authorized to modify this playlist');
    return res.status(403).json({ error: 'Not authorized to modify this playlist' });
  }
  req.playlist = playlist;
  next();
};

export const canAccessPlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const userId = req.user?._id;

    const isOwner =
      playlist.user &&
      playlist.user.toString() === userId?.toString();

    const isShared =
      playlist.sharedWith?.some(id =>
        id.toString() === userId?.toString()
      );

    const isPublic = !playlist.user;

    if (!isOwner && !isShared && !isPublic) {
      return res.status(403).json({ error: 'No access to this playlist' });
    }

    req.playlist = playlist;
    next();
  } catch (err) {
    console.error('Access check failed:', err.message);
    res.status(500).json({ error: err.message });
  }
};