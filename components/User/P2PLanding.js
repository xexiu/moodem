import React, { Component } from 'react';
import io from 'socket.io-client';
//import TrackPlayer from 'react-native-track-player';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    YellowBox
} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { SearchBar, ListItem, ButtonGroup, Icon } from 'react-native-elements';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { MainContainer } from '../common/MainContainer';
import { HeaderContainer } from '../common/HeaderContainer';
import { BurgerMenuIcon } from '../common/BurgerMenuIcon';
import { TopSearchBar } from '../common/TopSearchBar';
import { BodyContainer } from '../common/BodyContainer';
import { PlayerContainer } from '../common/PlayerContainer';
import { SongInfoContainer } from '../common/SongInfoContainer';
import { PlayerControlsContainer } from '../common/PlayerControlsContainer';
import { TracksListContainer } from '../common/TracksListContainer';
import { SongInfoALbum } from '../common/SongInfoALbum';
import { SongInfoTitle } from '../common/SongInfoTitle';
import { SongInfoArtist } from '../common/SongInfoArtist';
import { SongInfoTime } from '../common/SongInfoTime';
import { PlayerControlShuffle } from '../common/PlayerControlShuffle';
import { PlayerControlBackward } from '../common/PlayerControlBackward';
import { PlayerControlPlayPause } from '../common/PlayerControlPlayPause';
import { PlayerControlForward } from '../common/PlayerControlForward';
import { PlayerControlRepeat } from '../common/PlayerControlRepeat';
import { TrackListItems } from '../common/TrackListItems';
import { TrackListItem } from '../common/TrackListItem';
import { clearStorage, setStorage } from '../../src/js/Utils/User/session';

let renderCalled = 0;

const LIST_TRACKS = [
    {
        album: {
            name: 'Album Name1'
        },
        name: 'Track1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Track2',
        artists: [
            {
                name: 'Artist2'
            }
        ]
    }
]

// check local storage
// if token exists then set state with token
// else set token to null

// debugger;
// const headers = { "Authorization": "Bearer " + data.access_token };
//     fetch('https://api.spotify.com/v1/search?q=calladita&type=track,playlist&limit=10', {
//       headers
//     })
//       .then(resp => {
//         debugger;
//         return resp.json();
//       })
//       .then(data => {
//         debugger;
//       });

function getArtists(artists) {
    const _artisits = [];
    artists.map(artist => { _artisits.push(artist.name)});

    return _artisits.join(', ');
}

function isEmpty(x) {
	return !x || (x.constructor !== Number && Object.keys(x).length === 0);
}

export class P2PLanding extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://192.168.10.12:3000', {
            transports: ['websocket'],
            jsonp: false,
            reconnectionAttempts: "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            timeout: 10000, //before connect_error and connect_timeout are emitted.
            "force new connection": true
        });

        this.state = {
            isConnected: false,
            searchedTracksList: [],
            search: '',
            isVotedSong: 0,
            isPremiumSong: null,
            hasError: false,
            showLoadingSpin: false,
            songName: 'Waiting...',
            artistName: '',
            listTracks: LIST_TRACKS,
            clearIconState: true,
            text: [],
            showListTracks: 0,
            isSearchingTracks: false,
            songAlbum: 'The Hunting Party',
            songTitle: 'Final Masquerade',
            songArtist: 'Linkin Park',
            songTime: '4:52'
        }
    }

    messageFromServer = (name, artists, album) => {
        console.log('messageFromServer() sent to all sockets', name, artists, album);
        this.setState({
            listTracks: [...this.state.listTracks, {
                name: name,
                artists: artists,
                album: !isEmpty(album) ? album : 'No album'
            }]
        });
    }

    componentWillUnmount() {
        // Cancel all subscriptions in order to prevent memory leaks
        this.socket = null;
    }

    componentDidMount() {
        this.socket.on('server-send-message', this.messageFromServer.bind(this));
        this.socket.on('connect', function () {
            this.setState({ isConnected: true });
        }.bind(this));
    }

    handlingOnPressSearch = (searchedTracks) => {
        this.setState({
            searchedTracksList: searchedTracks,
            isSearchingTracks: true
        })
    }

    sendSocketMsg = (songName, artistName, albumName) => {
        this.socket.emit('send-message', songName, artistName, albumName);

    }

    dispatchActionsSearchedTrack = ({ artists, name, album }) => {
        this.setState({
            searchedTracksList: [],
            isSearchingTracks: false
        });

        this.sendSocketMsg(name, artists, !isEmpty(album) ? album.name : 'No album');
    }

    dispatchActionsPressedTrack = ({ artists, name, album }) => {
        this.setState({
            songAlbum: !isEmpty(album) ? album.name : 'No album',
            songTitle: name,
            songArtist: getArtists(artists)
        });
    }

    handlingTrackItemPressed = (isSearchingTracks, track) => {
        if (isSearchingTracks) {
            this.dispatchActionsSearchedTrack(track)
        } else {
            this.dispatchActionsPressedTrack(track)
        }
    }

    render() {
        console.log('Called render()', renderCalled++)
        const {
            search,
            showLoadingSpin,
            songAlbum,
            songTitle,
            songArtist,
            songTime,
            listTracks,
            searchedTracksList,
            clearIconState,
            isSearchingTracks
        } = this.state;
        const {
            token,
            refreshToken,
            spotifyApi
        } = this.props;

        return (
            <ErrorBoundary>
                <MainContainer>
                    <HeaderContainer>
                        <BurgerMenuIcon />
                        <TopSearchBar actionOnPressSearch={this.handlingOnPressSearch.bind(this)} token={token} refreshToken={refreshToken} spotifyApi={spotifyApi} />
                    </HeaderContainer>
                    <BodyContainer>
                        <PlayerContainer>
                            <SongInfoContainer>
                                <SongInfoALbum songAlbum={songAlbum} />
                                <SongInfoTitle songTitle={songTitle} />
                                <SongInfoArtist songArtist={songArtist} />
                                <SongInfoTime songTime={songTime} />
                            </SongInfoContainer>
                            <PlayerControlsContainer>
                                <PlayerControlShuffle />
                                <PlayerControlBackward />
                                <PlayerControlPlayPause />
                                <PlayerControlForward />
                                <PlayerControlRepeat />
                            </PlayerControlsContainer>
                        </PlayerContainer>
                        <TracksListContainer>
                            <TrackListItems data={isSearchingTracks ? searchedTracksList : listTracks} actionOnPressItem={this.handlingTrackItemPressed.bind(this, isSearchingTracks)}>
                                <TrackListItem />
                            </TrackListItems>
                        </TracksListContainer>
                    </BodyContainer>
                </MainContainer>
            </ErrorBoundary>
        );
    }
}