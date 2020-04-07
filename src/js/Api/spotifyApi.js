const apiCredentials = {
    clientId: 'fe1b8e46e4f048009d55382540d3fa5f',
    clientSecret: '5a6d65bb87f840ac963a30f448b314df',
    redirectUri: 'https://auth.expo.io/@sergio.m/moodem'
}

const BASE_URL = 'https://api.spotify.com/v1';

export const authHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
});

export const tokenHeaders = {
    Authorization: `Basic ${apiCredentials.clientId}:${apiCredentials.clientSecret}`
};

export const getToken = () => 'https://accounts.spotify.com/api/token';

export const fetchSearch = () =>
    `${BASE_URL}/search?q=${query}&type=track`;