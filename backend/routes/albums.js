import { Router } from 'express';
import Album from '../models/Album.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const albums = await Album.find().populate('artist', 'name');
    res.json(albums);
  } catch (err) {
    console.error('Albums list failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('artist', 'name');
    if (!album) {
      console.error('Album by ID: Album not found');
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json(album);
  } catch (err) {
    console.error('Album by ID failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const album = await Album.create(req.body);
    await album.populate('artist', 'name');
    res.status(201).json(album);
  } catch (err) {
    console.error('Create album failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('artist', 'name');
    if (!album) {
      console.error('Update album: Album not found');
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json(album);
  } catch (err) {
    console.error('Update album failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) {
      console.error('Delete album: Album not found');
      return res.status(404).json({ error: 'Album not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Delete album failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
