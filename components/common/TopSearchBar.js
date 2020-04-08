import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import { Dimensions } from 'react-native';
import { getFromStorage, setStorage } from '../../src/js/Utils/User/session';

import {
    auth as SpotifyAuth,
    remote as SpotifyRemote,
    ApiScope,
    ApiConfig
} from 'react-native-spotify-remote';

const spotifyApi = {
    clientID: 'fe1b8e46e4f048009d55382540d3fa5f',
    clientSecret: '5a6d65bb87f840ac963a30f448b314df',
    redirectURL: 'moodem://spotify-login-callback',
    tokenRefreshURL: "http://localhost:3000/refresh",
    tokenSwapURL: "http://localhost:3000/swap",
    playURI: 'spotify:track:7p5bQJB4XsZJEEn6Tb7EaL',
    showDialog: false,
    scope: ApiScope.AppRemoteControlScope | ApiScope.UserFollowReadScope
};

const MARGIN_RIGHT = 80;
const MAX_INTENTS = 5;
const {
    width
} = Dimensions.get('window');
let intents = 0;

function handleCancelSearchBar() {
    this.setState({
        showLoadingSpin: false
    });
};


function logInWithSpotify(spotifyApi) {
    const auth = spotifyApi.createAuthorizeURL('/authorize');

    fetch(auth)
        .then(resp => resp.text())
        .then(data => {
            debugger;
        })
        .catch(err => {
            debugger;
        })
}


function soundCloud(query, limit = 10, page = 0) {
    const SC_KEY = 'b8f06bbb8e4e9e201f9e6e46001c3acb';

    return fetch(
        `https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=${SC_KEY}&limit=${limit}&offset=${page * limit}&linked_partitioning=1`
    ).then(res => res.json())
        .then(json => {
            debugger
        })
        .catch(err => {
            debugger;
        });
}

async function playEpicSong() {
    try {
        const token = await SpotifyAuth.initialize(spotifyApi);
        await SpotifyRemote.connect(token);
        await SpotifyRemote.isConnectedAsync();

        await SpotifyRemote.playUri("spotify:track:7p5bQJB4XsZJEEn6Tb7EaL");
        await SpotifyRemote.seek(58000);
    } catch (err) {
        console.error("Couldn't authorize with or connect to Spotify", err);
    }
}

function playEpicSong2(token) {
    //const token = await SpotifyAuth.initialize(spotifyApi);
    SpotifyRemote.connect(token)
        .then(data => {

            debugger;
            console.log('DATA', data);
        });
}

function handlePressSeachOnEnd() {
    this.setState({
        showLoadingSpin: !!this.state.searchText,
        clearIconState: true,
        showLoadingSpin: false,
        searchText: ''
    });

}

function updateSearch(searchText) {
    this.setState({
        searchText,
        clearIconState: true
    });
};

function clearSearchbar() {
    console.log('Search was cleared');
    this.setState({
        searchText: '',
        clearIconState: false,
        showLoadingSpin: false
    });
};

export class TopSearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clearIconState: true,
            searchText: '',
            showLoadingSpin: false
        }
    }

    render() {
        const {
            clearIconState,
            searchText,
            showLoadingSpin
        } = this.state;

        const {
            actionOnPressSearch,
            token,
            spotifyApi
        } = this.props;

        return (
            <SearchBar
                containerStyle={{
                    width: width - MARGIN_RIGHT, padding: 0, backgroundColor: '#fff',
                    borderRadius: 25,
                    borderColor: '#eee',
                    borderWidth: 2,
                }}
                inputContainerStyle={{
                    borderRadius: 25,
                    backgroundColor: '#fff',
                    height: 35
                }}
                lightTheme={true}
                clearIcon={clearIconState}
                placeholder="Search song..."
                onChangeText={updateSearch.bind(this)}
                value={searchText}
                onClear={clearSearchbar.bind(this)}
                showLoading={showLoadingSpin}
                onCancel={handleCancelSearchBar.bind(this)}
                onEndEditing={() => {
                    const searchText = this.state.searchText;

                    if (!!searchText) {
                        this.setState({
                            showLoadingSpin: true
                        });

                        spotifyApi.fetchTracksOnSearch(`/v1/search?q=${searchText}&type=track,playlist&limit=40`, token, repeat = (data) => {
                            const error = data.error;
                            if (error && error.status === 401 && error && error.message === 'The access token expired' && intents < MAX_INTENTS) {
                                intents++;
                                spotifyApi.fetchAccessToken('/api/token', (data) => {
                                    getFromStorage('spotifyAuth').then(session => {
                                        const obj = JSON.parse(session);
                                        setStorage('spotifyAuth', {
                                            access_token: data.access_token,
                                            token_type: obj.token_type
                                        }, spotifyApi.fetchTracksOnSearch(`/v1/search?q=${searchText}&type=track,playlist&limit=40`, data.access_token, repeat));
                                    });
                                })
                            } else {
                                //logInWithSpotify(spotifyApi);
                                actionOnPressSearch(data.tracks.items);
                                soundCloud('Calladita');
                                // SpotifyRemote.connect(token)
                                //     .then(data => {
                                //         debugger;
                                //         remote.playUri("spotify:track:6IA8E2Q5ttcpbuahIejO74")
                                //             .then(data => {
                                //                 debugger;
                                //                 remote.seek(58000);
                                //             });
                                //     });
                                handlePressSeachOnEnd.call(this);
                            }
                        });
                    }
                }}
            />
        )
    }
}