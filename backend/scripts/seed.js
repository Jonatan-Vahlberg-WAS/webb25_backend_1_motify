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

// Last.fm images: name -> large URL (extralarge if available, else large)
const ARTIST_IMAGES = {
  'Bad Bunny': 'https://hips.hearstapps.com/hmg-prod/images/puerto-rican-singer-bad-bunny-attends-the-premiere-of-news-photo-1757619516.pjpeg?crop=0.668xw:1.00xh;0.114xw,0&resize=640:*',
  'PinkPantheress': 'https://thegentlewoman.co.uk/img/L3FPMzFsL1V2dllkTDRIdUxCS25yZz09/tgw32-pinkpantheress-2000px-3.jpg',
  'Taylor Swift': 'https://static.wikia.nocookie.net/taylor-swift/images/e/e8/TaylorSwiftApr09.jpg/revision/latest/scale-to-width-down/985?cb=20251201165849',
  'Addison Rae': 'https://static.wikia.nocookie.net/addison-rae/images/1/10/Addison_Rae_%282024%29.jpg/revision/latest?cb=20241022011136',
  'Djo': 'https://static.independent.co.uk/2025/10/08/17/16/DJO-ON-CANAL-The-Independent-exclusive-2025-photo-credit-Piers-Greenan.jpg?crop=1365,1365,x341.6,y0&width=1200&height=1200',
  'Sabrina Carpenter': 'https://shop.umusic.com.au/cdn/shop/files/Sabrina_Carpenter_Square_a46d36cf-863a-4588-b69e-02bdabf73001.jpg?v=1750135260&width=900',
  'Olivia Dean': 'https://shop.umusic.com.au/cdn/shop/files/Olivia_Dean_Square_66597cdf-dc9f-4f5b-882a-c84b0a98663c.jpg?v=1752550640&width=900',
  'RAYE': 'https://static01.nyt.com/images/2023/02/03/multimedia/03raye-01-vkqm/03raye-01-vkqm-mediumSquareAt3X.jpg',
  'Zara Larsson': 'https://hips.hearstapps.com/hmg-prod/images/main-image-high-res-credit-erik-henriksson-1614956600.jpg?crop=0.7666666666666667xw:1xh;center,top&resize=640:*',
  'sombr': 'https://event-images.tixel.com/cdn-cgi/image/w=1600,f=webp,q=70/media/images/929b09362dff1e8c60c2ec7054e25148_1753084141_7119_square_l.jpg',
  'The Marías': 'https://images.squarespace-cdn.com/content/v1/56c346b607eaa09d9189a870/1622754007972-S8UNCX86H1WJ612LJL8O/THE+MARIAS+FLAUNT+.jpeg',
  'Chappell Roan': 'https://pyxis.nymag.com/v1/imgs/9e3/6aa/f40b2581614d3d81217e1e86045b6b07f0-chappell-roan.2x.rsquare.w330.jpg',
  'Harry Styles': 'https://media.vogue.co.uk/photos/5eec89ea8d5f1419f361974f/1:1/w_4128,h_4128,c_limit/GettyImages-1203531045.jpg',
  'Billie Eilish': 'https://m.media-amazon.com/images/I/61HGO-p3K8L._AC_UF1000,1000_QL80_.jpg',
  'Tame Impala': 'https://static01.nyt.com/images/2020/03/10/arts/08popcast-print/08popcast-mediumSquareAt3X.jpg',
  'Radiohead': 'https://dailycollegian.com/wp-content/uploads/2019/02/24068568_10154797654647245_943477172805599310_o-900x900.jpeg',
  'EsDeeKid': 'https://cdn-images.dzcdn.net/images/artist/afad4388b6359c9d3fef0110d01efcd3/1900x1900-000000-80-0-0.jpg',
  'She & Him': 'https://i1.sndcdn.com/avatars-000454351245-wl49n6-t1080x1080.jpg',
  'Kendrick Lamar': 'https://static01.nyt.com/images/2024/11/26/multimedia/26amplifier-nl-tlpm/26amplifier-nl-tlpm-mediumSquareAt3X.jpg',
  'Arctic Monkeys': 'https://www.nme.com/wp-content/uploads/2016/09/2013ArcticMonkeysPR281113-1.jpg',
  'KATSEYE': 'https://www.the360mag.com/wp-content/uploads/2025/05/wp-17461754215467353007404961985188-1024x1024.jpg',
  'Joji': 'https://www.the360mag.com/wp-content/uploads/2025/10/wp-17604157808127076971282070209531.jpg',
  'Kanye West': 'https://static.dezeen.com/uploads/2016/08/kanye-west-ikea-collaboration-square_dezeen_936_0.jpg',
  'bôa': 'https://event-images.tixel.com/cdn-cgi/image/w=1600,f=webp,q=70/media/images/642d7565f59a9fc0700ba8afec0dc177_1716131098_1824_square_l.jpg',
  'TV Girl': 'https://scontent-cph2-1.cdninstagram.com/v/t51.75761-15/467512795_18471911254049296_3516460392965200224_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ig_cache_key=MzUwNjQzNzMwMTIxODQzOTk0Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=TyYya81Dl7EQ7kNvwGeMct7&_nc_oc=Adl1KZ10T9kAJTlgoqisLZjsxAjbMAAtyx6HZ14Qsvhjzj6WfTw5Cprsia4QQAOJqfc&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-cph2-1.cdninstagram.com&_nc_gid=2OF_B3O9uKf29Ha8mtBpJQ&oh=00_AftGLVbkepeFrJ3DkfU0pz4VhycvV07bkkOaxVHAoEBAFw&oe=6993A454',
  'Tate McRae': 'https://ca-times.brightspotcdn.com/dims4/default/6e0fcee/2147483647/strip/true/crop/5464x8192+0+0/resize/1200x1799!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fd4%2Fc3%2F432674d94fd29f1553081d08f51b%2F1378051-ca-tate-mcrae-304.jpg',
  'Don Toliver': 'https://www.interviewmagazine.com/wp-content/uploads/2020/08/607A1684-1-scaled-e1596667219434.jpg',
  'Charli xcx': 'https://pyxis.nymag.com/v1/imgs/170/0f1/0b532886a92f8dc7076bdd59ee63eb9884-charlie-xcx.1x.rsquare.w1400.jpg',
  'Jeff Buckley': 'https://static01.nyt.com/images/2025/09/04/multimedia/30ST-BUCKLEY-01-wqfg/30ST-BUCKLEY-01-wqfg-mediumSquareAt3X.jpg',
};

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
    const name = ARTISTS[i];
    const image = ARTIST_IMAGES[name] ?? null;
    const artist = await Artist.create({ name, ...(image && { image }) });
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
