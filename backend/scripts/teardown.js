import 'dotenv/config';
import mongoose from 'mongoose';
import Song from '../models/Song.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Playlist from '../models/Playlist.js';

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/motify';

const runTeardown = async () => {
  await mongoose.connect(mongoURI);

  const songCount = await Song.countDocuments();
  const artistCount = await Artist.countDocuments();
  const albumCount = await Album.countDocuments();
  const playlistCount = await Playlist.countDocuments();

  await Playlist.deleteMany({});
  await Song.deleteMany({});
  await Album.deleteMany({});
  await Artist.deleteMany({});

  console.log(`Deleted ${playlistCount} playlists, ${songCount} songs, ${albumCount} albums, and ${artistCount} artists.`);

  await mongoose.disconnect();
  console.log('Teardown complete.');
  process.exit(0);
};

runTeardown().catch((err) => {
  console.error('Teardown failed:', err);
  process.exit(1);
});
