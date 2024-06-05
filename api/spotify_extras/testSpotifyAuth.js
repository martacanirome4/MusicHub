const getSpotifyToken = require('./utils/spotifyAuth');

(async () => {
  try {
    const token = await getSpotifyToken();
    console.log('Spotify Access Token:', token);
  } catch (error) {
    console.error('Error:', error);
  }
})();
