import { SPOTIFY_HOST, PERMISSIONS } from '../Constants/spotify';
import { doFetch } from '../ConnectionManager';
import { btoa } from '../Base64';

export default class SpotifyAPI {
    constructor(credentials) {
        this.credentials = credentials || {};
    }

    createAuthorizeURL(path) {
        return `${SPOTIFY_HOST}${path}?response_type=code&client_id=${this.getClientId()}&scope=${encodeURIComponent(PERMISSIONS)}&redirect_uri=${encodeURIComponent(this.getRedirectURI())}`
    }

    setCredentials(_credentials) {
        for (var key in _credentials) {
            if (_credentials.hasOwnProperty(key)) {
                this.credentials[key] = _credentials[key];
            }
        }
    }

    getTokenWithAuthorizationCode(path, callback) {
        doFetch(`${SPOTIFY_HOST}${path}`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(`${this.getClientId()}:${this.getClientSecret()}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=authorization_code&code=${this.getAuthorizationCode()}&redirect_uri=${this.getRedirectURI()}`,
        }, callback);
    }

    getTokenWithRefreshedToken(path, refreshToken, callback) {
        doFetch(`${SPOTIFY_HOST}${path}`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(`${this.getClientId()}:${this.getClientSecret()}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        }, callback);
    }

    searchTracks(path, token, callback){
        doFetch(`https://api.spotify.com${path}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, callback);
    }

    getCredentials() {
        return this.credentials;
    }

    resetCredentials() {
        this.credentials = null;
    }

    setClientId(clientId) {
        this._setCredential('clientId', clientId);
    }

    setClientSecret(clientSecret) {
        this._setCredential('clientSecret', clientSecret);
    }

    setAuthorizationCode(code) {
        this._setCredential('authorizationCode', code);
    }

    setAccessToken(accessToken) {
        this._setCredential('accessToken', accessToken);
    }

    setTokenType(tokenType){
        this._setCredential('tokenType', tokenType);
    }

    setRefreshToken(refreshToken) {
        this._setCredential('refreshToken', refreshToken);
    }

    setRedirectURI(redirectUri) {
        this._setCredential('redirectUri', redirectUri);
    }

    getAuthorizationCode() {
        return this._getCredential('authorizationCode');
    }

    getRedirectURI() {
        return this._getCredential('redirectUri');
    }

    getClientId() {
        return this._getCredential('clientId');
    }

    getClientSecret() {
        return this._getCredential('clientSecret');
    }

    getAccessToken() {
        return this._getCredential('accessToken');
    }

    getTokenType() {
        return this._getCredential('tokenType');
    }

    getRefreshToken() {
        return this._getCredential('refreshToken');
    }

    resetClientId() {
        this._resetCredential('clientId');
    }

    resetClientSecret() {
        this._resetCredential('clientSecret');
    }

    resetAccessToken() {
        this._resetCredential('accessToken');
    }

    resetRefreshToken() {
        this._resetCredential('refreshToken');
    }

    resetRedirectURI() {
        this._resetCredential('redirectUri');
    }

    _setCredential(credentialKey, value) {
        this.credentials = this.credentials || {};
        this.credentials[credentialKey] = value;
    }

    _getCredential(credentialKey) {
        if (!this.credentials) {
            return;
        } else {
            return this.credentials[credentialKey];
        }
    }

    _resetCredential(credentialKey) {
        if (!this.credentials) {
            return;
        } else {
            this.credentials[credentialKey] = null;
        }
    }
}