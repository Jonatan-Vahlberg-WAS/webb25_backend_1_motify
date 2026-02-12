import { Router } from 'express';
import Song from '../models/Song.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().populate('artist', 'name')
      .populate('album', 'title releaseDate');
    res.json(songs);
  } catch (err) {
    console.error('Songs list failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('artist', 'name')
      .populate('album', 'title releaseDate');
    if (!song) {
      console.error('Song by ID: Song not found');
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    console.error('Song by ID failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const song = await Song.create(req.body);
    await song.populate([
      { path: 'artist', select: 'name' },
      { path: 'album', select: 'title releaseDate' },
    ]);
    res.status(201).json(song);
  } catch (err) {
    console.error('Create song failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('artist', 'name')
      .populate('album', 'title releaseDate');
    if (!song) {
      console.error('Update song: Song not found');
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    console.error('Update song failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      console.error('Delete song: Song not found');
      return res.status(404).json({ error: 'Song not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Delete song failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
