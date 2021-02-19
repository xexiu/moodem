/* eslint-disable max-len */
import React, { Component } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import Video from 'react-native-video';
import { SC_KEY } from '../../src/js/Utils/constants/api/apiKeys';
import { PlayerControlBackward } from '../common/PlayerControlBackward';
import { PlayerControlForward } from '../common/PlayerControlForward';
import { PlayerControlPlayPause } from '../common/PlayerControlPlayPause';
import { PlayerControlRepeat } from '../common/PlayerControlRepeat';
import { PlayerControlsContainer } from '../common/PlayerControlsContainer';
import { PlayerControlShuffle } from '../common/PlayerControlShuffle';
import { PlayerControlTimeSeek } from '../common/PlayerControlTimeSeek';
import { SongInfoAlbumCover } from '../common/SongInfoAlbumCover';
import { SongInfoArtist } from '../common/SongInfoArtist';
import { SongInfoContainer } from '../common/SongInfoContainer';
import { SongInfoTitle } from '../common/SongInfoTitle';
import { PreLoader } from './functional-components/PreLoader';

const TRACK_DURATION_MASQUERADE = 217;
const MASQUERADE_SONG = 'https://api.soundcloud.com/tracks/157980361/stream';

export class Player extends Component {
    public toastRef: any;
    public tracks: any;
    public state: any;
    public setState: any;
    public player: any;
    public props: any;
    public songAlbumCover: any;
    public songTitle: any;
    public songArtist: any;
    public songIndex: any;
    public currentSong: any;
    public isPlaying: any;
    public shouldRepeat: any;
    public shouldShuffle: any;
    public trackCurrentTime: any;
    public trackMaxDuration: any;
    public songIsReady: any;

    constructor(props) {
        super(props);

        this.toastRef = React.createRef();
        this.tracks = [];
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
            isSongLoading: true,
            trackMaxDuration: TRACK_DURATION_MASQUERADE,
        };
    }

    onPlayProgress = ({ currentTime }) => {
        this.setState({
            trackCurrentTime: currentTime,
        });
    };

    onPlayEnd = (tracks, songIndex, shouldShuffle, shouldRepeat, isPlaying) => {
        this.setState({ trackCurrentTime: 0 });
        const index = tracks.length ? songIndex + 1 : 0;

        if (shouldRepeat) {
            return this.dispatchActionsPressedTrack(tracks[index]);
        } else if (shouldShuffle) {
            const random = Math.floor((Math.random() * tracks.length) + 0);

            if (tracks[random]) {
                return this.dispatchActionsPressedTrack(tracks[random]);
            }
        } else if (!tracks[index]) {
            this.setState({ isPlaying: !isPlaying });
        } else {
            return tracks[index] && this.dispatchActionsPressedTrack(tracks[index]);
        }
    };

    onBuffer = (buffer) => {
        if (!this.state.isBuffering) {
            this.toastRef.current.show('Song Ready!');
            this.setState({ isBuffering: buffer.isBuffering, songIsReady: !buffer.isBuffering });
        }
    };

    onAudioError = ({ error }) => {
        this.toastRef.current.show(`There was an error loading the Audio. ${error.code}`, 1000);
    };

    dispatchActionsPressedTrack = (track) => {
        this.setState({
            currentSong: track.stream_url,
            songAlbumCover: track.artwork_url,
            songTitle: track.title,
            songArtist: track.user && track.user.username,
            songIndex: track.index,
            trackMaxDuration: track.duration,
            isPlaying: true,
        });
    };

    handleOnPressPlayPause = (isPlaying) => {
        this.setState({ isPlaying: !isPlaying });
    };

    handleOnPressForward = (tracks, songIndex) => {
        if (tracks.length > 1) {
            this.setState({ trackCurrentTime: 0 });
        }
        if (tracks[songIndex + 1]) {
            this.dispatchActionsPressedTrack(tracks[songIndex + 1]);
        }
    };

    handleOnPressBackward = (tracks, songIndex) => {
        if (tracks.length > 1) {
            this.setState({ trackCurrentTime: 0 });
        }
        if (tracks[songIndex - 1]) {
            this.dispatchActionsPressedTrack(tracks[songIndex - 1]);
        }
    };

    hanleOnPressRepeat = (shouldRepeat) => {
        this.setState({
            shouldRepeat: !shouldRepeat,
        });
    };

    hanleOnPressShuffle = (shouldShuffle) => {
        this.setState({
            shouldShuffle: !shouldShuffle,
        });
    };

    handleOnTouchMoveSliderSeek = (time) => {
        this.player.seek(time);
    };

    render() {
        const {
            songAlbumCover,
            songTitle,
            songArtist,
            songIndex,
            currentSong,
            isPlaying,
            shouldRepeat,
            shouldShuffle,
            trackCurrentTime,
            trackMaxDuration,
            songIsReady,
        } = this.state;
        const {
            tracks,
        } = this.props;

        return (
            <View>
                <Video
                    source={{ uri: `${currentSong}?client_id=${SC_KEY}` }}
                    ref={ref => {
                        this.player = ref;
                    }}
                    volume={1.0}
                    audioOnly
                    muted={false}
                    playInBackground
                    playWhenInactive
                    ignoreSilentSwitch={'ignore'}
                    onBuffer={this.onBuffer}
                    onError={this.onAudioError}
                    paused={!isPlaying}
                    onLoad={() => this.setState({ isBuffering: false, songIsReady: false })}
                    onLoadStart={() => this.setState({ trackCurrentTime: 0, isBuffering: true, songIsReady: false })}
                    onProgress={this.onPlayProgress}
                    onEnd={this.onPlayEnd.bind(this, tracks, songIndex, shouldShuffle, shouldRepeat, isPlaying)}
                    repeat={shouldRepeat}
                />

                <SongInfoContainer>
                    <SongInfoAlbumCover songAlbumCover={songAlbumCover} />
                    <SongInfoTitle songTitle={songTitle} />
                    <SongInfoArtist songArtist={songArtist} />
                </SongInfoContainer>
                <PlayerControlsContainer>
                    <PlayerControlShuffle shouldShuffle={shouldShuffle} onPressShuffle={this.hanleOnPressShuffle.bind(this)} />
                    <PlayerControlBackward onPressBackward={this.handleOnPressBackward.bind(this, tracks, songIndex)} />
                    {!songIsReady ?
                        <PreLoader size={58} containerStyle={{}} /> :
                        <PlayerControlPlayPause isPlaying={isPlaying} onPressPlayPause={this.handleOnPressPlayPause.bind(this)} />
                    }
                    <PlayerControlForward onPressForward={this.handleOnPressForward.bind(this, tracks, songIndex)} />
                    <PlayerControlRepeat shouldRepeat={shouldRepeat} onPressRepeat={this.hanleOnPressRepeat.bind(this)} />
                    <PlayerControlTimeSeek trackLength={trackMaxDuration} currentPosition={trackCurrentTime} onTouchMove={this.handleOnTouchMoveSliderSeek.bind(this)} />
                </PlayerControlsContainer>
                <Toast
                    position='top'
                    ref={this.toastRef}
                />
            </View>
        );
    }
}
