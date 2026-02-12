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
