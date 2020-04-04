import React, { Component } from 'react';
import { View } from 'react-native';
import { CustomButton } from '../common/CustomButton';
import { BgImage } from '../common/BgImage';
import { setStorage } from '../../src/js/Utils/User/session';
import styles from '../../src/css/styles/Login.scss';
import { AuthSession } from 'expo';

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

    render() {
        const {
            customButtonRef
        } = this.state;
        const {
            spotifyApi,
            updateState
        } = this.props;
        return (
            <View style={styles["login-container"]}>
                <BgImage source={require('../../assets/images/logo_moodem.png')} />
                <CustomButton
                    ref={customButtonRef}
                    btnTitle="Login with Spotify"
                    btnStyle="btn-green"
                    btnOnPress={() => {
                        customButtonRef.current.updateLoadingBtn(true);
                        logInWithSpotify.call(this, customButtonRef, spotifyApi, updateState);
                    }}
                />
            </View>
        );
    }
}