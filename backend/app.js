import express from 'express';
import cors from 'cors';
import artistsRouter from './routes/artists.js';
import albumsRouter from './routes/albums.js';
import songsRouter from './routes/songs.js';
import playlistsRouter from './routes/playlists.js';
import authRouter from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Motify API is running' });
});

app.use('/auth', authRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/albums', albumsRouter);
app.use('/api/songs', songsRouter);
app.use('/api/playlists', playlistsRouter);

export default app;
