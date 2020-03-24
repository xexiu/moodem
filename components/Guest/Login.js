import React, { Component } from 'react';
import SpotifyAPI from '../../src/js/Utils/Spotify/SpotifyAPI';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';
import { AuthSession } from 'expo';
/* eslint-disable class-methods-use-this */

const spotifyApi = new SpotifyAPI({
    clientId: 'fe1b8e46e4f048009d55382540d3fa5f',
    clientSecret: '5a6d65bb87f840ac963a30f448b314df',
    redirectUri: 'https://auth.expo.io/@sergio.m/moodem'
});

function setStorage(data) {
    AsyncStorage.setItem(
        'spotifyAuth',
        JSON.stringify({
            access_token: data.access_token,
            token_type: data.token_type,
            refresh_token: data.refresh_token
        })).then(this.props.updateState(data));
}

function handleActions(data) {
    setStorage.call(this, data);
    spotifyApi.resetCredentials();
    spotifyApi.setAccessToken(data.access_token);
    spotifyApi.setTokenType(data.token_type);
    spotifyApi.setRefreshToken(data.refresh_token);
}

function logInWithSpotify() {
    getAuthorizationCode(() => {
        spotifyApi.getTokenWithAuthorizationCode('/api/token', handleActions.bind(this));
    })
}

function getAuthorizationCode(callback) {
    AuthSession.startAsync({
        authUrl: spotifyApi.createAuthorizeURL('/authorize'),
    }).then(data => {
        spotifyApi.setAuthorizationCode(data.params.code);
        return callback && callback();
    })
        .catch(err => {
            reject(new Error('getAuthorizationCode()', err.message))
        });
}

export class Login extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={logInWithSpotify.bind(this)}
                >
                    <Text style={styles.buttonText}> Login </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});