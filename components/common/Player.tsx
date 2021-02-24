/* eslint-disable max-len */
import React, { Component, memo } from 'react';
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

const TRACK_DURATION_MASQUERADE = 217;
const MASQUERADE_SONG = 'https://api.soundcloud.com/tracks/157980361/stream';

class Player extends Component {
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
    public paused: any;
    public shouldRepeat: any;
    public shouldShuffle: any;
    public trackCurrentTime: any;
    public trackMaxDuration: any;
    public songIsReady: any;

    constructor(props: any) {
        super(props);

        this.toastRef = React.createRef();
        this.tracks = [];
        this.state = {
            songAlbumCover: 'https://i1.sndcdn.com/artworks-000084701264-i1px5r-large.jpg',
            songTitle: 'Final Masquerade',
            songArtist: 'Linkin Park',
            songIndex: 0,
            paused: true,
            currentSong: MASQUERADE_SONG,
            isBuffering: true,
            shouldRepeat: false,
            shouldShuffle: false,
            songIsReady: false,
            trackCurrentTime: 0,
            trackMaxDuration: TRACK_DURATION_MASQUERADE
        };
    }

    onPlayProgress = ({ currentTime }: any) => {
        this.setState({
            trackCurrentTime: currentTime
        });
    };

    onPlayEnd = (tracks: any, songIndex: number, shouldShuffle: boolean, shouldRepeat: boolean) => {
        if (shouldRepeat) {
            this.dispatchActionsPressedTrack(tracks[songIndex]);
            this.player.seek(0);
        } else if (shouldShuffle) {
            const random = Math.floor((Math.random() * tracks.length) + 0);

            if (tracks[random]) {
                this.dispatchActionsPressedTrack(tracks[random]);
            }
        } else {
            // next track
            if (tracks[songIndex + 1]) {
                this.player.seek(0);
                return this.dispatchActionsPressedTrack(tracks[songIndex + 1]);
            }
        }
    };

    onBuffer = (buffer: any) => {
        this.setState({ isBuffering: buffer.isBuffering, songIsReady: !buffer.isBuffering });
    };

    onAudioError = ({ error }: any) => {
        this.toastRef.current.show(`There was an error loading the Audio. ${error.code}`, 1000);
    };

    dispatchActionsPressedTrack = (track: any) => {
        this.setState({
            currentSong: track.stream_url,
            songAlbumCover: track.artwork_url,
            songTitle: track.title,
            songArtist: track.user && track.user.username,
            songIndex: track.index,
            trackMaxDuration: track.duration,
            paused: track.index === this.state.songIndex ? ! this.state.paused : false
        });
    };

    handleOnPressPlayPause = (paused: boolean) => {
        this.setState({ paused: !paused });
    };

    handleOnPressForward = (tracks: any, songIndex: number) => {
        if (tracks[songIndex + 1]) {
            this.dispatchActionsPressedTrack(tracks[songIndex + 1]);
        }
    };

    handleOnPressBackward = (tracks: any, songIndex: number) => {
        if (tracks.length > 1) {
            this.setState({ trackCurrentTime: 0 });
        }
        if (tracks[songIndex - 1]) {
            this.dispatchActionsPressedTrack(tracks[this.state.songIndex - 1]);
        }
    };

    hanleOnPressRepeat = () => {
        this.setState({
            shouldRepeat: !this.state.shouldRepeat
        });
    };

    hanleOnPressShuffle = () => {
        this.setState({
            shouldShuffle: !this.state.shouldShuffle
        });
    };

    handleOnTouchMoveSliderSeek = (time: any) => {
        this.player.seek(time);
    };

    resetPlayLastSong = (tracks: any, songIndex: number, shouldShuffle: boolean, shouldRepeat: boolean) => {
        let groupLength = tracks.length;

        while (groupLength--) {
            if (groupLength === 0) {
                this.setState({ trackCurrentTime: 0, songIndex: tracks.length, paused: true });
                this.player.seek(0);
                return this.onPlayEnd(tracks, songIndex, shouldShuffle, shouldRepeat);
            }
        }
    };

    render() {
        const {
            songAlbumCover,
            songTitle,
            songArtist,
            songIndex,
            currentSong,
            paused,
            shouldRepeat,
            shouldShuffle,
            trackCurrentTime,
            trackMaxDuration,
            songIsReady
        } = this.state;
        const {
            tracks
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
                    onBuffer={(buffer) => this.onBuffer(buffer)}
                    onError={(error) => this.onAudioError(error)}
                    paused={paused}
                    onLoad={() => {
                        this.setState({ trackCurrentTime: 0, isBuffering: false });
                    }}
                    onLoadStart={() => {
                        this.tracks = tracks;
                        this.setState({ trackCurrentTime: 0, isBuffering: false });
                    }
                    }
                    onProgress={this.onPlayProgress}
                    onEnd={() => {
                        const songEnded = setTimeout(() => {
                            this.resetPlayLastSong(tracks, songIndex, shouldShuffle, shouldRepeat);

                            if (!shouldRepeat) {
                                this.setState({ trackCurrentTime: 0, paused: true });
                                this.player.seek(0);
                                clearTimeout(songEnded);
                                return this.onPlayEnd(tracks, songIndex, shouldShuffle, shouldRepeat);
                            } else {
                                this.setState({ trackCurrentTime: 0, paused: true });
                                clearTimeout(songEnded);
                                return this.onPlayEnd(tracks, songIndex, shouldShuffle, shouldRepeat);
                            }
                        }, 100);
                    }}
                    repeat={shouldRepeat}
                />

                <SongInfoContainer>
                    <SongInfoAlbumCover songAlbumCover={songAlbumCover} />
                    <SongInfoTitle songTitle={songTitle} />
                    <SongInfoArtist songArtist={songArtist} />
                </SongInfoContainer>
                <PlayerControlsContainer>
                    <PlayerControlShuffle
                        shouldShuffle={shouldShuffle}
                        onPressShuffle={this.hanleOnPressShuffle}
                    />
                    <PlayerControlBackward
                        onPressBackward={() => this.handleOnPressBackward(tracks, songIndex)}
                    />
                    <PlayerControlPlayPause
                        paused={paused}
                        onPressPlayPause={this.handleOnPressPlayPause}
                        songIsReady={songIsReady}
                    />
                    <PlayerControlForward
                        onPressForward={() => this.handleOnPressForward(tracks, songIndex)}
                    />
                    <PlayerControlRepeat
                        shouldRepeat={shouldRepeat}
                        onPressRepeat={this.hanleOnPressRepeat}
                    />
                    <PlayerControlTimeSeek
                        trackLength={trackMaxDuration}
                        currentPosition={trackCurrentTime}
                        songIsReady={songIsReady}
                        onTouchMove={(time: any) => this.handleOnTouchMoveSliderSeek(time)}
                    />
                </PlayerControlsContainer>
                <Toast
                    position='top'
                    ref={this.toastRef}
                />
            </View>
        );
    }
}

memo(Player);

export { Player };
