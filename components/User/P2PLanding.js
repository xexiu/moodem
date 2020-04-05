import io from 'socket.io-client';
import React, { Component } from 'react';
import { YellowBox } from 'react-native';
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

YellowBox.ignoreWarnings([
    'Remote debugger',
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

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

function getArtists(artists) {
    const _artisits = [];
    artists.map(artist => { _artisits.push(artist.name) });

    return _artisits.join(', ');
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
            searchedTracksList: [],
            isVotedSong: 0,
            isPremiumSong: null,
            listTracks: LIST_TRACKS,
            isSearchingTracks: false,
            songAlbum: 'The Hunting Party',
            songTitle: 'Final Masquerade',
            songArtist: 'Linkin Park',
            songTime: '4:52'
        }
    }

    messageFromServer = (name, artists, album) => {
        this.setState({
            listTracks: [...this.state.listTracks, {
                name: name,
                artists: artists,
                album: album
            }]
        });
    }

    componentWillUnmount() {
        // Cancel all subscriptions in order to prevent memory leaks
        this.socket = null;
        this.handlingOnPressSearch = null;
        this.handlingTrackItemPressed = null;
    }

    componentDidMount() {
        this.socket.on('server-send-message', this.messageFromServer.bind(this));
    }

    handlingOnPressSearch = (searchedTracks) => {
        this.setState({
            searchedTracksList: searchedTracks,
            isSearchingTracks: true
        })
    }

    sendSocketMsg = (name, artits, album) => {
        this.socket.emit('send-message', name, artits, album);

    }

    dispatchActionsSearchedTrack = ({ artists, name, album = { name: 'No Album' } }) => {
        this.setState({
            searchedTracksList: [],
            isSearchingTracks: false
        });

        this.sendSocketMsg(name, artists, album);
    }

    dispatchActionsPressedTrack = ({ artists, name, album = { name: 'No Album' } }) => {
        this.setState({
            songAlbum: album.name,
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
            songAlbum,
            songTitle,
            songArtist,
            songTime,
            listTracks,
            searchedTracksList,
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
                        <TopSearchBar
                            actionOnPressSearch={this.handlingOnPressSearch.bind(this)}
                            token={token}
                            refreshToken={refreshToken}
                            spotifyApi={spotifyApi}
                        />
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
                            <TrackListItems
                                data={isSearchingTracks ? searchedTracksList : listTracks}
                                trackItemPressed={this.handlingTrackItemPressed.bind(this, isSearchingTracks)}
                            />
                        </TracksListContainer>
                    </BodyContainer>
                </MainContainer>
            </ErrorBoundary>
        );
    }
}