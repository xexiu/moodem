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

function convertToTimeDuration(duration) {
    let totalDuration;

    if (String(duration).length === 5) {
        totalDuration = String(duration).substr(0, 2);
    } else if (String(duration).length > 5) {
        totalDuration = String(duration).substr(0, 3);
    }

    return Number(totalDuration);
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
            songIndex: 0,
            songTime: '4:52',
            isPlaying: false,
            currentSong: 'https://api.soundcloud.com/tracks/31406576/stream',
            isBuffering: true,
            shouldRepeat: false,
            shouldShuffle: false,
            trackCurrentTime: 0,
            trackMaxDuration: 0,
            time: 100
        }

        this.loadAudio = this.loadAudio.bind(this);
    }

    messageFromServer = (track) => {
        this.state.listTracks.push(track);

        for (let i = 0; i < this.state.listTracks.length; i++) {
            const track = this.state.listTracks[i];
            track.index = i
        }

        this.setState({
            listTracks: [...this.state.listTracks]
        });
    }

    componentWillUnmount() {
        // Cancel all subscriptions in order to prevent memory leaks
        this.socket = null;
        this.handlingOnPressSearch = null;
        this.handlingTrackPressed = null;
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
            isSearchingTracks: !!searchedTracks.length
        });
    }

    sendSocketMsg = (track) => {
        this.socket.emit('send-message', track);

    }

    dispatchActionsSearchedTrack = (track) => {
        this.setState({
            currentSong: track.stream_url,
            songAlbum: track.name,
            songTitle: track.title,
            songArtist: track.user && track.user.username,
            songIndex: track.index
        });
    }

    dispatchActionsPressedTrack = (track) => {
        console.log('Presssed', track)
        this.setState({
            currentSong: track.stream_url,
            songAlbum: track.name,
            songTitle: track.title,
            songArtist: track.user && track.user.username,
            songIndex: track.index
        });
    }

    handlingTrackPressed = (isSearchingTracks, track) => {
        if (isSearchingTracks) {
            this.setState({ isPlaying: !this.state.isPlaying });
            this.dispatchActionsSearchedTrack(track)
        } else {
            this.setState({ isPlaying: !this.state.isPlaying });
            this.dispatchActionsPressedTrack(track)
        }
    }

    sendSongToTrackList = (track) => {
        this.setState({
            searchedTracksList: [],
            isSearchingTracks: false,
            trackMaxDuration: convertToTimeDuration(track.duration)
        });

        this.sendSocketMsg(track);
    }


    handleOnPressPlayPause = (isPlaying) => {
        this.setState({ isPlaying: !isPlaying });
    }

    handleOnPressForward = (tracks, songIndex) => {
        if (tracks[songIndex + 1]) {
            this.dispatchActionsPressedTrack(tracks[songIndex + 1])
        } else {
            this.dispatchActionsPressedTrack(tracks[songIndex - 1])
        }
    }

    handleOnPressBackward = (tracks, songIndex) => {
        if (tracks[songIndex - 1]) {
            this.dispatchActionsPressedTrack(tracks[songIndex - 1])
        } else {
            this.dispatchActionsPressedTrack(tracks[songIndex + 1])
        }
    }

    hanleOnPressRepeat = (shouldRepeat) => {
        this.setState({
            shouldRepeat: !shouldRepeat
        });
    }

    hanleOnPressShuffle = (tracks, shouldShuffle) => {
        const random = Math.floor((Math.random() * tracks.length) + 0);
        if (tracks[random]) {
            this.dispatchActionsPressedTrack(tracks[random]);
            this.setState({
                shouldShuffle: !shouldShuffle
            });
        }
    }

    seek(trackCurrentTime) {
        this.setState({
            currentPosition: trackCurrentTime,
            paused: false
        });

        this.refs.audioElement && this.refs.audioElement.seek(200);
    }

    async loadAudio() {
        // To Do
    }

    onPlayProgress = ({ currentTime }) => {
        this.setState({
            trackCurrentTime: currentTime
        });
    }

    onPlayEnd = (tracks, songIndex) => {
        tracks[songIndex + 1] && this.dispatchActionsPressedTrack(tracks[songIndex + 1]);
    }

    onBuffer = (buffer) => {
        const { isBuffering } = buffer;
        this.setState({ isBuffering });
    }

    onAudioError = (error) => {
        console.log('There was an error on: onAudioError()', error)
    }

    handleOnTouchMove = (move) => {
        console.log('You moved me', move);
        this.player.seek();
    }

    render() {
        console.log('Called render()', renderCalled++)
        const {
            songAlbum,
            songTitle,
            songArtist,
            songIndex,
            songTime,
            listTracks,
            searchedTracksList,
            isSearchingTracks,
            currentSong,
            isPlaying,
            isBuffering,
            shouldRepeat,
            shouldShuffle,
            trackCurrentTime,
            trackMaxDuration
        } = this.state;
        const {
            token,
            spotifyApi
        } = this.props;
        const tracks = isSearchingTracks ? searchedTracksList : listTracks

        return (
            <ErrorBoundary>
                <MainContainer>
                    <HeaderContainer>
                        <BurgerMenuIcon />
                        <TopSearchBar
                            fillTracksList={this.handlingOnPressSearch.bind(this)}
                            token={token}
                            spotifyApi={spotifyApi}
                        />
                    </HeaderContainer>
                    <BodyContainer>
                        <PlayerContainer>

                            <View style={this.props.style}>
                                <Video source={{ uri: `${currentSong}?client_id=${SC_KEY}` }} //https://p.scdn.co/mp3-preview/6bd1eafc0bdc2930072eb216cf169f4d6ffbf876?cid=fe1b8e46e4f048009d55382540d3fa5f // STREAM -- > https://api.soundcloud.com/tracks/631459077/stream?client_id=b8f06bbb8e4e9e201f9e6e46001c3acb
                                    ref={(ref) => {
                                        this.player = ref
                                    }}
                                    volume={1.0}
                                    muted={false}
                                    playInBackground={true}
                                    playWhenInactive={true}
                                    onBuffer={this.onBuffer}
                                    onError={this.onAudioError}
                                    paused={!isPlaying}
                                    onProgress={this.onPlayProgress}
                                    onEnd={this.onPlayEnd.bind(this, tracks, songIndex)}
                                    repeat={shouldRepeat} />
                            </View>

                            <SongInfoContainer>
                                <SongInfoTitle songTitle={songTitle} />
                                <SongInfoArtist songArtist={songArtist} />
                            </SongInfoContainer>
                            <PlayerControlsContainer>
                                <PlayerControlShuffle shouldShuffle={shouldShuffle} onPressShuffle={this.hanleOnPressShuffle.bind(this, tracks)} />
                                <PlayerControlBackward onPressBackward={this.handleOnPressBackward.bind(this, tracks, songIndex)} />
                                {isBuffering ?
                                    <PreLoader /> :
                                    <PlayerControlPlayPause isPlaying={isPlaying} onPressPlayPause={this.handleOnPressPlayPause.bind(this)} />
                                }
                                <PlayerControlForward onPressForward={this.handleOnPressForward.bind(this, tracks, songIndex)} />
                                <PlayerControlRepeat shouldRepeat={shouldRepeat} onPressRepeat={this.hanleOnPressRepeat.bind(this)} />
                                <PlayerControlTimeSeek trackLength={trackMaxDuration} currentPosition={trackCurrentTime} onSlidingStart={() => this.setState({ paused: true })} onSeek={this.seek.bind(this, trackCurrentTime)} onTouchMove={this.handleOnTouchMove.bind(this)} />
                            </PlayerControlsContainer>
                        </PlayerContainer>
                        <TracksListContainer>
                            <TrackListItems
                                isSearchingTracks={isSearchingTracks}
                                data={tracks}
                                trackPressed={this.handlingTrackPressed.bind(this, isSearchingTracks)}
                                sendSongToTrackList={this.sendSongToTrackList.bind(this)}
                            />
                        </TracksListContainer>
                    </BodyContainer>
                </MainContainer>
            </ErrorBoundary>
        );
    }
}