import express from 'express';
import cors from 'cors';
import Artist from './models/Artist.js';
import Song from './models/Song.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Motify API is running' });
});

app.get('/api/artists', async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find().populate('artist', 'name');
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
