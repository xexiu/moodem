import React, { Component } from 'react';
import { View, Linking, Text } from 'react-native';
import { CustomButton } from '../common/functional-components/CustomButton';
import { BgImage } from '../common/BgImage';
import { setStorage } from '../../src/js/Utils/User/session';
import { btoa } from '../../src/js/Utils/Base64';

const apiCredentials = {
    clientId: 'fe1b8e46e4f048009d55382540d3fa5f',
    clientSecret: '5a6d65bb87f840ac963a30f448b314df',
    redirectUri: 'https://auth.expo.io/@sergio.m/moodem'
}

function handleActions(data, updateState, spotifyApi) {
    setStorage('spotifyAuth', {
        access_token: data.access_token,
        token_type: data.token_type,
        refresh_token: data.refresh_token
    }, updateState(data));

    spotifyApi.setAccessToken(data.access_token);
    spotifyApi.setTokenType(data.token_type);
    spotifyApi.setRefreshToken(data.refresh_token);
}

function logInWithSpotify(customButtonRef, spotifyApi, updateState) {
    getAuthorizationCode(customButtonRef, spotifyApi, () => {
        spotifyApi.getTokenWithAuthorizationCode('/api/token', data => {
            handleActions(data, updateState, spotifyApi)
        });
    });
}

function getAuthorizationCode(customButtonRef, spotifyApi, callback) {
    AuthSession.startAsync({
        authUrl: spotifyApi.createAuthorizeURL('/authorize'),
    }).then(data => {
        spotifyApi.setAuthorizationCode(data.params.code);
        return callback && callback();
    })
        .catch(err => {
            customButtonRef.current.updateLoadingBtn(false);
            throw new Error('getAuthorizationCode()', err.message);
        });
}

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            customButtonRef: React.createRef()
        }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        //logErrorToMyService(error, info);
    }

    componentDidMount() {
        this.initAccessToken();
    }

    initAccessToken = () => {
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(`${apiCredentials.clientId}:${apiCredentials.clientSecret}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=client_credentials`
        })
            .then(resp => resp.json())
            .then(data => {
                debugger;
            });
    }

    render() {
        const {
            customButtonRef
        } = this.state;
        const {
            spotifyApi,
            updateState
        } = this.props;
        const authURL = spotifyApi.createAuthorizeURL('/authorize');
        return (
            <View style={loginContainer}>
                <BgImage source={require('../../assets/images/logo_moodem.png')} />
                {/* <CustomButton
                    ref={customButtonRef}
                    btnTitle="Login with Spotify"
                    btnStyle={{ background: '#90c520', borderWidth: 0, width: 200, marginLeft: 'auto', marginRight: 'auto' }}
                    btnOnPress={() => {
                        customButtonRef.current.updateLoadingBtn(true);
                        logInWithSpotify.call(this, customButtonRef, spotifyApi, updateState);
                    }}
                /> */}

                <Text style={{ color: 'blue' }}
                    onPress={() => Linking.openURL(`${authURL}`)}>
                    Google
</Text>
            </View>
        );
    }
}

const loginContainer = {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center'
}