/* eslint-disable max-len */
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import { MediaListEmpty } from '../../screens/User/functional-components/MediaListEmpty';
import BodyContainer from '../common/functional-components/BodyContainer';
import CommonFlatList from '../common/functional-components/CommonFlatList';
import PlayerControlNextPrev from '../common/PlayerControlNextPrev';
import PlayerControlPlayPause from '../common/PlayerControlPlayPause';
import { PlayerControlRepeat } from '../common/PlayerControlRepeat';
import { PlayerControlsContainer } from '../common/PlayerControlsContainer';
import PlayerControlShuffle from '../common/PlayerControlShuffle';
import SongInfoAlbumCover from '../common/SongInfoAlbumCover';
import SongInfoArtist from '../common/SongInfoArtist';
import { SongInfoContainer } from '../common/SongInfoContainer';
import SongInfoTitle from '../common/SongInfoTitle';
import Song from '../User/functional-components/Song';
import BasePlayer from './BasePlayer';

function cleanImageParams(img: string) {
    if (img.indexOf('hqdefault.jpg') >= 0) {
        return img.replace(/(\?.*)/g, '');
    }
    return img;
}

function cleanTitle(title: string) {
    return title && title.replace('VEVO', '') || '';
}

let SHOULD_SHUFFLE = false;
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
    public flatListRef: any;

    constructor(props: any) {
        super(props);

        console.log('CONSTRUCTOR');
        this.toastRef = React.createRef();
        this.flatListRef = React.createRef();

        this.state = {
            currentSong: {},
            tracks: [],
            shouldShuffle: false,
            shouldRepeat: false,
            isBuffering: false
        };
    }

    shouldComponentUpdate(prevProps: any, nextProps: any) {
        // console.log('Should Update Prev', prevProps, 'NextProps', nextProps);
        // // if (prevProps.tracks &&
        // //     !!prevProps.tracks.length &&
        // //     !nextProps.isLoading &&
        // //     !nextProps.isBuffering) {
        // //     return true;
        // // }

        // if (prevProps.tracks[nextProps.currentSong.index].index === nextProps.currentSong.index) {
        //     return true;
        // }

        return true;
    }

    componentDidMount() {
        if (this.props.tracks && this.props.tracks.length) {
            console.log('ComponentDidUpdate');
            this.setState({
                tracks: [...this.props.tracks],
                currentSong: { ...this.props.tracks[0] }
            });
        }
    }

    onPlayEnd = (tracks: any, songIndex: number, shouldShuffle: boolean, shouldRepeat: boolean) => {
        if (shouldRepeat) {
            this.dispatchActionsPressedTrack(tracks[songIndex], null);
        } else if (shouldShuffle) {
            const random = Math.floor((Math.random() * tracks.length) + 0);

            if (tracks[random]) {
                this.dispatchActionsPressedTrack(tracks[random], null);
            }
        } else {
            // next track
            if (tracks[songIndex + 1]) {
                this.player.seek(0);
                this.dispatchActionsPressedTrack(tracks[songIndex + 1], null);
            }
        }
    };

    onBuffer = (buffer: any) => {
        this.setState({ isBuffering: buffer.isBuffering, songIsReady: !buffer.isBuffering });
    };

    onAudioError = ({ error }: any) => {
        this.toastRef.current.show(`There was an error loading the Audio. ${error.code}`, 1000);
    };

    dispatchActionsPressedTrack = (track: any, cb: Function) => {
        this.setState({
            currentSong: track
        }, () => {
            this.tracks.forEach((_track: any) => {
                if (track.index === _track.index) {
                    Object.assign(track, {
                        isPlaying: this.state.currentSong.isPlaying,
                        isCurrentSongPlaying: true
                    });
                } else if (track.index !== _track.index && _track.isCurrentSongPlaying) {
                    Object.assign(_track, {
                        isPlaying: false,
                        isCurrentSongPlaying: false
                    });
                }
            });

            console.log('Tracks', this.tracks);
        });
    };

    handleOnPressPlayPause = (paused: boolean) => {
        this.setState({ paused: !paused });
    };

    handleOnPressForward = (tracks: any, songIndex: number) => {
        if (tracks[songIndex + 1]) {
            this.dispatchActionsPressedTrack(tracks[songIndex + 1], null);
        }
    };

    handleOnPressNextPrev = (track: any) => {
        console.log('Track back', track);
        this.markCurentSong(track);
        this.setIsPlayingPaused(track);
    };

    hanleOnPressRepeat = () => {
        this.setState({
            shouldRepeat: !this.state.shouldRepeat
        });
    };

    hanleOnPressShuffle = (shouldShuffle: boolean, random: number) => {
        console.log('HandlePressedSgufle', shouldShuffle, 'Random', random, 'Item', this.itemRef);
        SHOULD_SHUFFLE = shouldShuffle;
        // this.setState({
        //     shouldShuffle: !shouldShuffle
        // });
        // this.markCurentSong(this.itemRef.current);
        // this.setIsPlayingPaused(this.state.tracks[random]);
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

    markCurentSong = (track: any) => {
        // tslint:disable-next-line:max-line-length
        // all songs props should be updated on this.tracks in order to be updated also on FlatList data (this.state.tracks)
        if (track.index === this.state.currentSong.index) {
            // update is playing
            Object.assign(this.state.tracks[track.index], {
                isPlaying: !track.isPlaying
            });
        } else if (this.state.tracks[this.state.currentSong.index]) {
            // update track on this tracks
            Object.assign(this.state.tracks[this.state.currentSong.index], {
                isPlaying: false
            });
        }

        if (track.index !== this.state.currentSong.index) {
            Object.assign(this.state.tracks[track.index], {
                isPlaying: !track.isPlaying
            });
        }
    };

    setIsPlayingPaused = (track: any) => { // should MarkCurrentSong before setIsPlayingPaused
        this.setState({
            currentSong: { ...track }
        });
    };

    manageTrack = (track: any) => {
        const nextPrevIndex = this.state.tracks.length ? track.index + 1 : 0;
        // if should repeat, then repeat, if not
        // then check if should suffle, if not
        // add + 1 and go next song
        // const nextIndex = ++track.index % this.state.tracks.length;

        if (this.state.shouldRepeat) {
            // return currentSong
        } else if (this.state.shouldShuffle) {
            // return random song
        }

        // check if next has been pressed
        // check if prev has been pressed

        // check if item is single or last song in the array

        // return next song

        console.log('Tracks', this.state.tracks[track.index + 1]);

        if (this.state.tracks[nextPrevIndex]) {
            this.markCurentSong(this.state.tracks[nextPrevIndex]);
            this.setIsPlayingPaused(this.state.tracks[nextPrevIndex]);
        } else {
            this.markCurentSong(track);
            this.setIsPlayingPaused(track);
        }

        console.log('track manage');
    };

    handleBuffer = (isBuffering: boolean) => {
        this.setState({ isBuffering });
    };

    render() {
        const {
            tracks,
            currentSong,
            isBuffering,
            shouldShuffle,
            shouldRepeat
        } = this.state;
        const {
            user,
            player
        } = this.props;

        if (!Object.keys(currentSong).length) {
            return (<MediaListEmpty />);
        }

        const keyExtractor = (item: any) => item.index.toString();

        return (
            <BodyContainer>
                <SongInfoContainer>
                    <SongInfoAlbumCover songAlbumCover={cleanImageParams(currentSong.videoDetails.thumbnails[0].url)} />
                    <SongInfoTitle songTitle={currentSong.videoDetails.title} />
                    <SongInfoArtist songArtist={cleanTitle(currentSong.videoDetails.author.name)} />
                </SongInfoContainer>
                {/* <PlayerControlShuffle
                        shouldShuffle={shouldShuffle}
                        onPressShuffle={() => {
                            this.setState({
                                shouldRepeat: false
                            });
                            this.hanleOnPressShuffle();
                        }}
                    />
                    <PlayerControlBackward
                        onPressBackward={() => this.handleOnPressBackward(tracks, songIndex)}
                    /> */}
                {/* <PlayerControlForward
                        onPressForward={() => this.handleOnPressForward(tracks, songIndex)}
                    />
                    <PlayerControlRepeat
                        shouldRepeat={shouldRepeat}
                        onPressRepeat={() => {
                            this.setState({
                                shouldShuffle: false
                            });
                            this.hanleOnPressRepeat();
                        }}
                    />*/}
                <PlayerControlsContainer>
                    <PlayerControlNextPrev
                        action='prev'
                        nextPrevSong={currentSong.index - 1}
                        currentSong={currentSong}
                        tracks={tracks}
                        onPressHandler={this.handleOnPressNextPrev}
                    />
                    <PlayerControlPlayPause
                        isBuffering={isBuffering}
                        currentSong={currentSong}
                        tracks={tracks}
                        flatListRef={this.flatListRef}
                        onPressHandler={(flatListItem: any) => {
                            // tslint:disable-next-line:max-line-length
                            // item needs to come from flatList ref in order to sync with play/pause button and items from FlatList
                            this.markCurentSong(flatListItem);
                            this.setIsPlayingPaused(flatListItem);
                        }}
                    />
                    <PlayerControlNextPrev
                        action='next'
                        nextPrevSong={currentSong.index + 1}
                        currentSong={currentSong}
                        tracks={tracks}
                        onPressHandler={this.handleOnPressNextPrev}
                    />
                </PlayerControlsContainer>
                <BasePlayer
                    handleBuffer={this.handleBuffer}
                    manageTrack={this.manageTrack}
                    currentSong={currentSong}
                    player={player}
                />
                <CommonFlatList
                    style={{ marginTop: 20 }}
                    reference={this.flatListRef}
                    data={this.state.tracks}
                    extraData={this.state}
                    keyExtractor={keyExtractor}
                    action={({ item, index }) => {
                        return (
                            // <Song
                            //     song={item}
                            //     user={user}
                            // />
                            <TouchableOpacity
                                style={{ padding: 10 }}
                                onPress={() => {
                                    this.markCurentSong(item);
                                    this.setIsPlayingPaused(item);
                                    // this.dispatchActionsPressedTrack(item, null);
                                }}
                            >
                                <View>
                                    <Text>Song {item.index} is Playing: {String(item.isPlaying)}, Title: ${item.videoDetails.title}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
                <Toast
                    position='top'
                    ref={this.toastRef}
                />
            </BodyContainer>
        );
    }
}

export { Player };
