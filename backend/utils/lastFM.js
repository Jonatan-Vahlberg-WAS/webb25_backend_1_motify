import dotenv from 'dotenv';

dotenv.config();

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

export const getArtistImage = async (artistName) => {
    try {

  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json`;
  const response = await fetch(url);
  const data = await response.json();
  const artist = data?.artist;
  if(artist) {
    return {
        name: artist.name,
        image: artist.image
    }
  }
  } catch (error) {
    console.error('Error fetching artist image:', artistName, error);
    return null;
  }
};