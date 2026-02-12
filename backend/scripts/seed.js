import 'dotenv/config';
import mongoose from 'mongoose';
import Artist from '../models/Artist.js';
import Song from '../models/Song.js';

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/motify';

const ARTISTS = [
  'Bad Bunny', 'PinkPantheress', 'Taylor Swift', 'Addison Rae', 'Djo',
  'Sabrina Carpenter', 'Olivia Dean', 'RAYE', 'Zara Larsson', 'sombr',
  'The Marías', 'Chappell Roan', 'Harry Styles', 'Billie Eilish', 'Tame Impala',
  'Radiohead', 'EsDeeKid', 'She & Him', 'Kendrick Lamar', 'Arctic Monkeys',
  'KATSEYE', 'Joji', 'Kanye West', 'bôa', 'TV Girl', 'Tate McRae',
  'Don Toliver', 'Charli xcx', 'Jeff Buckley',
];

const SONGS = [
  [1, 'DtMF', 237, 12124362, 1010468],
  [1, 'NUEVAYoL', 183, 9227326, 800583],
  [2, 'Stateside + Zara Larsson', 176, 7596071, 620552],
  [1, 'BAILE INoLVIDABLE', 367, 9569942, 733372],
  [3, 'Opalite', 235, 12250095, 673700],
  [4, 'Fame Is a Gun', 183, 15940114, 885366],
  [1, 'VOY A LLeVARTE PA PR', 204, 7550784, 622907],
  [1, 'EoO', 204, 7376978, 608104],
  [5, 'End of Beginning', 159, 31449067, 1898696],
  [6, 'Manchild', 213, 20726530, 1129648],
  [7, 'Man I Need', 184, 7004554, 723107],
  [8, 'WHERE IS MY HUSBAND!', 196, 8102749, 815760],
  [9, 'Midnight Sun', 189, 8275684, 527654],
  [7, 'So Easy (To Fall In Love)', 170, 5879677, 699660],
  [3, 'The Fate of Ophelia', 226, 21494557, 941110],
  [10, 'back to friends', 199, 21499022, 1305590],
  [11, 'No One Noticed', 236, 30429397, 1480035],
  [12, 'Good Luck, Babe!', 218, 57136264, 2009749],
  [13, 'Aperture', 311, 2653089, 437485],
  [11, 'Sienna', 224, 17515037, 1083097],
  [14, 'WILDFLOWER', 261, 33911896, 1562914],
  [15, 'The Less I Know the Better', 217, 45761290, 2648161],
  [9, 'Lush Life', 201, 11998517, 1347431],
  [16, 'Creep', 235, 57490366, 3979194],
  [6, 'Tears', 160, 13421859, 937121],
  [17, '4 Raws', 147, 7034286, 599247],
  [1, 'VeLDÁ', null, 5551848, 475280],
  [14, 'BIRDS OF A FEATHER', 183, 53220164, 2144933],
  [18, 'I Thought I Saw Your Face Today', 185, 5938693, 764807],
  [19, 'luther (with SZA)', null, 26282958, 1469739],
  [16, 'Let Down', 337, 37752378, 2418066],
  [15, 'Dracula', 205, 7354561, 811315],
  [1, 'WELTiTA', null, 4024931, 441160],
  [20, '505', 305, 55379462, 2921008],
  [21, 'Gabriela', 197, 15763004, 911589],
  [22, 'PIXELATED KISSES', 110, 7954857, 449492],
  [1, 'Tití Me Preguntó', 117, 10075951, 772697],
  [1, 'PERFuMITO NUEVO', null, 3705610, 417252],
  [23, 'Flashing Lights', 237, 35147129, 2122950],
  [24, 'Duvet', 203, 38814782, 1892590],
  [25, 'Lovers Rock', 213, 47949504, 2089268],
  [6, 'Espresso', 175, 53224676, 2096809],
  [26, 'Sports car', 165, 20215915, 871052],
  [10, '12 to 12', 242, 7448683, 691746],
  [22, 'LAST OF A DYING BREED', 149, 931892, 193148],
  [1, 'KLOuFRENS', 290, 4312793, 404662],
  [12, 'The Subway', 252, 15376946, 892822],
  [27, 'E85', null, 799400, 173333],
  [28, 'Von dutch', 164, 30059883, 1381578],
  [29, "Lover, You Should've Come Over", 403, 28912474, 1540300],
  [3, 'Anti-Hero (Acoustic)', 185, 8923412, 521000],
  [14, 'What Was I Made For?', 220, 28472918, 1523000],
  [20, 'Do I Wanna Know?', 272, 41258391, 2281900],
  [19, 'HUMBLE.', 177, 38927456, 2156000],
];

const runSeed = async () => {
  await mongoose.connect(mongoURI);

  const artistCount = await Artist.countDocuments();
  const songCount = await Song.countDocuments();

  if (artistCount > 0 || songCount > 0) {
    console.log('Collections not empty. Skipping seed.');
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log('Seeding database...');

  const artistIds = {};
  for (let i = 0; i < ARTISTS.length; i++) {
    const artist = await Artist.create({ name: ARTISTS[i] });
    artistIds[i + 1] = artist._id;
  }
  console.log(`Created ${ARTISTS.length} artists`);

  for (const [artistId, title, durationSeconds, playcount, listeners] of SONGS) {
    await Song.create({
      artist: artistIds[artistId],
      title,
      durationSeconds: durationSeconds ?? null,
      playcount,
      listeners,
    });
  }
  console.log(`Created ${SONGS.length} songs`);

  await mongoose.disconnect();
  console.log('Seed complete.');
  process.exit(0);
};

runSeed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
