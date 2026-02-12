import { Router } from 'express';
import Playlist from '../models/Playlist.js';
import { requireAuth } from '../middleware/auth.js';
import { isPlaylistOwner } from '../middleware/ownership.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.user = req.query.user;

    const playlists = await Playlist.find(filter)
      .populate('songs', 'title artist durationSeconds')
      .populate('user', 'email');
    res.json(playlists);
  } catch (err) {
    console.error('Playlists list failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate({ path: 'songs', populate: { path: 'artist', select: 'name' } })
      .populate('user', 'email');
    if (!playlist) {
      console.error('Playlist by ID: Playlist not found');
      return res.status(404).json({ error: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (err) {
    console.error('Playlist by ID failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const body = {
      name: req.body.name,
      description: req.body.description,
      songs: req.body.songs || [],
      user: req.body.user ?? req.user._id,
    };
    const playlist = await Playlist.create(body);
    await playlist.populate('songs', 'title artist durationSeconds');
    await playlist.populate('user', 'email');
    res.status(201).json(playlist);
  } catch (err) {
    console.error('Create playlist failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, isPlaylistOwner, async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('songs', 'title artist durationSeconds')
      .populate('user', 'email');
    if (!playlist) {
      console.error('Update playlist: Playlist not found');
      return res.status(404).json({ error: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (err) {
    console.error('Update playlist failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, isPlaylistOwner, async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    if (!playlist) {
      console.error('Delete playlist: Playlist not found');
      return res.status(404).json({ error: 'Playlist not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Delete playlist failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
