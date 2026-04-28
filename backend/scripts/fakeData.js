import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from '../models/User.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Song from '../models/Song.js';
import Playlist from '../models/Playlist.js';

dotenv.config();

async function generateFakeData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/motify');
    console.log('✅ Ansluten till databasen');

    const myUser = await User.findOne({ email: 'lukas@email.com' });
    if (!myUser) {
      console.log('❌ Hittade inte lukas@email.com! Har du registrerat den?');
      process.exit(1);
    }

    await Artist.deleteMany({});
    await Album.deleteMany({});
    await Song.deleteMany({});
    await Playlist.deleteMany({});

    let friend = await User.findOne({ email: 'kompis@email.com' });
    if (!friend) {
      friend = await User.create({ email: 'kompis@email.com', password: 'password123' });
    }

    const artist1 = await Artist.create({ name: 'The Backend Boys' });
    const artist2 = await Artist.create({ name: 'Node.js Ninjas' });

    const album1 = await Album.create({ title: 'API Blues', artist: artist1._id, releaseDate: new Date('2023-05-15') });
    const album2 = await Album.create({ title: 'Async Await', artist: artist2._id, releaseDate: new Date('2024-02-10') });

    const song1 = await Song.create({ title: 'Callback Hell', artist: artist1._id, album: album1._id });
    const song2 = await Song.create({ title: 'Promise Me', artist: artist1._id, album: album1._id });
    const song3 = await Song.create({ title: 'Event Loop Dance', artist: artist2._id, album: album2._id });
    
    await Playlist.create({
      name: 'Min grymma kod-lista', 
      user: myUser._id, 
      songs: [song1._id, song3._id],
      sharedWith: [] 
    });

    console.log('🎉 Fejkdata skapad! En spellista är nu tilldelad till lukas@email.com!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Något gick fel:', error);
    process.exit(1);
  }
}

generateFakeData();