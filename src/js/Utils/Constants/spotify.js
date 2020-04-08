export const SPOTIFY_CREDENTIALS = {
    clientId: 'fe1b8e46e4f048009d55382540d3fa5f',
    clientSecret: '5a6d65bb87f840ac963a30f448b314df',
    redirectUri: 'https://auth.expo.io/@sergio.m/moodem'
}
export const PERMISSIONS_ARR = ['user-modify-playback-state', 'user-read-currently-playing', 'user-read-playback-state', 'user-library-modify',
    'user-library-read', 'playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public',
    'playlist-modify-private', 'user-read-recently-played', 'user-top-read', 'streaming', 'app-remote-control'];
export const PERMISSIONS = PERMISSIONS_ARR.join(' ');
export const SPOTIFY_HOST = 'https://accounts.spotify.com';