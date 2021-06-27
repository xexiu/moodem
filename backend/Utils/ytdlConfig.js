const { COOKIE } = require('./constants');
const { makeRandomChars } = require('./generators');

const headers = {
    Cookie: COOKIE,
    'x-youtube-client-version': '2.20191008.04.01',
    'x-youtube-client-name': '1',
    'x-client-data': '',
    'x-youtube-identity-token': 'QUFFLUhqbWtBX080QlRLNkQ3R2E2RXBWZGtXZFVjd1JuZ3w\u003d',
    'Accept-Encoding': 'identity;q=1, *;q=0',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
    referer: `https://${makeRandomChars(6)}.com`
};

const options = {
    requestOptions: {
        headers
    }
};

module.exports = {
    headers,
    options
};
