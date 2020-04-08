import io from 'socket.io-client';
import React, { Component } from 'react';
import Video from 'react-native-video';
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
import { SongInfoTitle } from '../common/SongInfoTitle';
import { SongInfoArtist } from '../common/SongInfoArtist';
import { PlayerControlShuffle } from '../common/PlayerControlShuffle';
import { PlayerControlBackward } from '../common/PlayerControlBackward';
import { PlayerControlPlayPause } from '../common/PlayerControlPlayPause';
import { PlayerControlForward } from '../common/PlayerControlForward';
import { PlayerControlRepeat } from '../common/PlayerControlRepeat';
import { PlayerControlTimeSeek } from '../common/PlayerControlTimeSeek';
import { TrackListItems } from '../common/TrackListItems';
import { SC_KEY } from '../../src/js//Utils/Constants/Api/soundCloud';
import { PreLoader } from '../common/PreLoader';
import { View, Text, TouchableHighlight } from 'react-native';

let renderCalled = 0;

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
            listTracks: [],
            isSearchingTracks: false,
            songAlbum: 'The Hunting Party',
            songTitle: 'Final Masquerade',
            songArtist: 'Linkin Park',
            songTime: '4:52',
            isPlaying: false,
            currentSong: 'https://api.soundcloud.com/tracks/31406576/stream',
            isBuffering: true
        }

        this.loadAudio = this.loadAudio.bind(this);
    }

    messageFromServer = (track) => {
        this.setState({
            listTracks: [...this.state.listTracks, track]
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
        this.loadAudio();
        this.initPlayer();
    }

    initPlayer = async () => {
        //await TrackPlayer.setupPlayer();
    };

    handlingOnPressSearch = (searchedTracks) => {
        this.setState({
            searchedTracksList: searchedTracks,
            isSearchingTracks: true
        })
    }

    sendSocketMsg = (track) => {
        this.socket.emit('send-message', track);

    }

    dispatchActionsSearchedTrack = (track) => {
        this.setState({
            searchedTracksList: [],
            isSearchingTracks: false
        });

        this.sendSocketMsg(track);
    }

    dispatchActionsPressedTrack = (track) => {
        console.log('Presssed', track)
        this.setState({
            currentSong: track.stream_url,
            isPlaying: true,
            songAlbum: track.name,
            songTitle: track.title,
            songArtist: track.user && track.user.username
        });
    }

    handlingTrackItemPressed = (isSearchingTracks, track) => {
        console.log('TRACKKKK', track);
        if (isSearchingTracks) {
            this.dispatchActionsSearchedTrack(track)
        } else {
            this.dispatchActionsPressedTrack(track)
        }
    }

    seek(time) {
        time = Math.round(time);
        //this.refs.audioElement && this.refs.audioElement.seek(time);
        this.setState({
            currentPosition: time,
            paused: false,
        });
    }

    async loadAudio() {
        // To Do
    }

    onPlayProgress = ({ currentTime }) => {
        // updatePlayerTime <-- seek
    }

    onPlayEnd = () => {
        // PlayNextSong on end
    }

    handlePlay = (isPlaying) => {
        this.setState({ isPlaying: !isPlaying });
    }

    onBuffer = (buffer) => {
        const { isBuffering } = buffer;
        console.log('Buffering ===>', isBuffering)
        this.setState({ isBuffering });
    }

    onAudioError = (error) => {
        console.log('There was an error on: onAudioError()', error)
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
            isSearchingTracks,
            currentSong,
            isPlaying,
            isBuffering
        } = this.state;
        const {
            token,
            spotifyApi
        } = this.props;

        console.log('Song', isBuffering);

        return (
            <ErrorBoundary>
                <MainContainer>
                    <HeaderContainer>
                        <BurgerMenuIcon />
                        <TopSearchBar
                            actionOnPressSearch={this.handlingOnPressSearch.bind(this)}
                            token={token}
                            spotifyApi={spotifyApi}
                        />
                    </HeaderContainer>
                    <BodyContainer>
                        <PlayerContainer>

                            <View style={this.props.style}>
                                <Video source={{ uri: `${currentSong}?client_id=${SC_KEY}` }} //https://p.scdn.co/mp3-preview/6bd1eafc0bdc2930072eb216cf169f4d6ffbf876?cid=fe1b8e46e4f048009d55382540d3fa5f // STREAM -- > https://api.soundcloud.com/tracks/631459077/stream?client_id=b8f06bbb8e4e9e201f9e6e46001c3acb
                                    ref='player'
                                    volume={1.0}
                                    muted={false}
                                    playInBackground={true}
                                    playWhenInactive={true}
                                    onBuffer={this.onBuffer}
                                    onError={this.onAudioError}
                                    paused={!isPlaying}
                                    onProgress={this.onPlayProgress}
                                    onEnd={this.onPlayEnd}
                                    repeat={false} />
                            </View>

                            <SongInfoContainer>
                                <SongInfoTitle songTitle={songTitle} />
                                <SongInfoArtist songArtist={songArtist} />
                            </SongInfoContainer>
                            <PlayerControlsContainer>
                                <PlayerControlShuffle />
                                <PlayerControlBackward />
                                {isBuffering ?
                                    <PreLoader /> :
                                    <PlayerControlPlayPause isPlaying={isPlaying} onPressHandler={this.handlePlay.bind(this)} />
                                }
                                <PlayerControlForward />
                                <PlayerControlRepeat />
                                <PlayerControlTimeSeek trackLength={176.13333} currentPosition={116.13333} onSlidingStart={() => this.setState({ paused: true })} onSeek={this.seek.bind(this)} />
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