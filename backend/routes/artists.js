import { Router } from 'express';
import Artist from '../models/Artist.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    console.error('Artists list failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      console.error('Artist by ID: Artist not found');
      return res.status(404).json({ error: 'Artist not found' });
    }
    res.json(artist);
  } catch (err) {
    console.error('Artist by ID failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const artist = await Artist.create(req.body);
    res.status(201).json(artist);
  } catch (err) {
    console.error('Create artist failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!artist) {
      console.error('Update artist: Artist not found');
      return res.status(404).json({ error: 'Artist not found' });
    }
    res.json(artist);
  } catch (err) {
    console.error('Update artist failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) {
      console.error('Delete artist: Artist not found');
      return res.status(404).json({ error: 'Artist not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Delete artist failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
