import express from 'express';
import cors from 'cors';
import artistsRouter from './routes/artists.js';
import songsRouter from './routes/songs.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Motify API is running' });
});

app.use('/api/artists', artistsRouter);
app.use('/api/songs', songsRouter);

export default app;
