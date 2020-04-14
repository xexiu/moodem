import Video from 'react-native-video';
import React, { Component } from 'react';
import { View } from 'react-native';
import { SC_KEY } from '../../src/js//Utils/Constants/Api/soundCloud';
import { SongInfoContainer } from '../common/SongInfoContainer';
import { PlayerControlsContainer } from '../common/PlayerControlsContainer';
import { SongInfoAlbumCover } from '../common/SongInfoAlbumCover';
import { SongInfoTitle } from '../common/SongInfoTitle';
import { SongInfoArtist } from '../common/SongInfoArtist';
import { PlayerControlShuffle } from '../common/PlayerControlShuffle';
import { PlayerControlBackward } from '../common/PlayerControlBackward';
import { PlayerControlPlayPause } from '../common/PlayerControlPlayPause';
import { PlayerControlForward } from '../common/PlayerControlForward';
import { PlayerControlRepeat } from '../common/PlayerControlRepeat';
import { PlayerControlTimeSeek } from '../common/PlayerControlTimeSeek';
import { PreLoader } from '../common/PreLoader';

const TRACK_DURATION_MASQUERADE = 217;
const MASQUERADE_SONG = 'https://api.soundcloud.com/tracks/157980361/stream';

let renderCalled = 0;

export class Player extends Component {
    constructor(props) {
        super(props);

        this.tracks = [];
        this.track = {};
        this.state = {
            songAlbumCover: 'https://i1.sndcdn.com/artworks-000084701264-i1px5r-large.jpg',
            songTitle: 'Final Masquerade',
            songArtist: 'Linkin Park',
            songIndex: 0,
            isPlaying: false,
            currentSong: MASQUERADE_SONG,
            isBuffering: true,
            shouldRepeat: false,
            shouldShuffle: false,
            songIsReady: false,
            trackCurrentTime: 0,
            trackMaxDuration: TRACK_DURATION_MASQUERADE
        }
    }

    getTracks() {
        return this.tracks;
    }

    getTrack() {
        return this.track;
    }

    setTracks(tracks) {
        this.tracks = tracks;
    }

    setTrack(track) {
        this.track = track;
    }

    dispatchActionCurrentPlayingTrack = (track) => {
        this.setState({ isPlaying: !this.state.isPlaying });
        //delete track.isCurrentlyPlaying;
    }

    dispatchActionsSearchedTrack = (track) => {
        this.setState({
            currentSong: track.stream_url,
            songAlbumCover: track.artwork_url,
            songTitle: track.title,
            songArtist: track.user && track.user.username,
            songIndex: track.index,
            trackMaxDuration: track.duration,
            isPlaying: true
        });
    }

    dispatchActionsPressedTrack = (track) => {
        this.setState({
            currentSong: track.stream_url,
            songAlbumCover: track.artwork_url,
            songTitle: track.title,
            songArtist: track.user && track.user.username,
            songIndex: track.index,
            trackMaxDuration: track.duration,
            isPlaying: true
        });
    }

    handlingTrackedPressed = (isSearchingTracks, track) => {
        if (isSearchingTracks) {
            this.dispatchActionsSearchedTrack(track)
        } else {
            this.dispatchActionsPressedTrack(track)
        }
    }

    handleOnPressPlayPause = (isPlaying) => {
        this.setState({ isPlaying: !isPlaying });
    }

    handleOnPressForward = (tracks, songIndex) => {
        if (tracks.length > 1) {
            this.setState({ trackCurrentTime: 0 });
        }
        tracks[songIndex + 1] && this.dispatchActionsPressedTrack(tracks[songIndex + 1]);
    }

    handleOnPressBackward = (tracks, songIndex) => {
        if (tracks.length > 1) {
            this.setState({ trackCurrentTime: 0 });
        }
        tracks[songIndex - 1] && this.dispatchActionsPressedTrack(tracks[songIndex - 1]);
    }

    hanleOnPressRepeat = (shouldRepeat) => {
        this.setState({
            shouldRepeat: !shouldRepeat
        });
    }

    hanleOnPressShuffle = (shouldShuffle) => {
        this.setState({
            shouldShuffle: !shouldShuffle
        });
    }

    handleOnTouchMoveSliderSeek = (time) => {
        this.player.seek(time)
    }

    onPlayProgress = ({ currentTime }) => {
        this.setState({
            trackCurrentTime: currentTime
        });
    }

    onPlayEnd = (tracks, songIndex, shouldShuffle, shouldRepeat, isPlaying) => {
        this.setState({ trackCurrentTime: 0 });
        const song = songIndex + 1;

        if (shouldRepeat) {
            return this.dispatchActionsPressedTrack(tracks[songIndex]);
        } else if (shouldShuffle) {
            const random = Math.floor((Math.random() * tracks.length) + 0);

            if (tracks[random]) {
                return this.dispatchActionsPressedTrack(tracks[random]);
            }
        } else if (!tracks[song]) {
            this.setState({ isPlaying:  !isPlaying });
        } else {
            return tracks[song] && this.dispatchActionsPressedTrack(tracks[song]);
        }
    }

    onBuffer = (buffer) => {
        const { isBuffering } = buffer;
        this.setState({ isBuffering, songIsReady: !isBuffering });
    }

    onAudioError = (error) => {
        console.log('There was an error on: onAudioError()', error)
    }

    render() {
        const {
            songAlbumCover,
            songTitle,
            songArtist,
            songIndex,
            currentSong,
            isPlaying,
            isBuffering,
            shouldRepeat,
            shouldShuffle,
            trackCurrentTime,
            trackMaxDuration
        } = this.state;
        const {
            tracks,
            playerRef
        } = this.props;

        return (
            <View ref={playerRef}>
                <Video source={{ uri: `${currentSong}?client_id=${SC_KEY}` }}
                    ref={ref => this.player = ref}
                    volume={1.0}
                    muted={false}
                    playInBackground={true}
                    playWhenInactive={true}
                    onBuffer={this.onBuffer}
                    onError={this.onAudioError}
                    paused={!isPlaying}
                    onProgress={this.onPlayProgress}
                    onEnd={this.onPlayEnd.bind(this, tracks, songIndex, shouldShuffle, shouldRepeat, isPlaying)}
                    repeat={shouldRepeat} />

                <SongInfoContainer>
                    <SongInfoAlbumCover songAlbumCover={songAlbumCover} />
                    <SongInfoTitle songTitle={songTitle} />
                    <SongInfoArtist songArtist={songArtist} />
                </SongInfoContainer>
                <PlayerControlsContainer>
                    <PlayerControlShuffle shouldShuffle={shouldShuffle} onPressShuffle={this.hanleOnPressShuffle.bind(this)} />
                    <PlayerControlBackward onPressBackward={this.handleOnPressBackward.bind(this, tracks, songIndex)} />
                    {isBuffering ?
                        <PreLoader size={58} /> :
                        <PlayerControlPlayPause isPlaying={isPlaying} onPressPlayPause={this.handleOnPressPlayPause.bind(this)} />
                    }
                    <PlayerControlForward onPressForward={this.handleOnPressForward.bind(this, tracks, songIndex)} />
                    <PlayerControlRepeat shouldRepeat={shouldRepeat} onPressRepeat={this.hanleOnPressRepeat.bind(this)} />
                    <PlayerControlTimeSeek trackLength={trackMaxDuration} currentPosition={trackCurrentTime} onTouchMove={this.handleOnTouchMoveSliderSeek.bind(this)} />
                </PlayerControlsContainer>
            </View>
        )
    }
}