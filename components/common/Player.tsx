/* eslint-disable max-len */
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import PreLoader from '../../components/common/functional-components/PreLoader';
import { MediaListEmpty } from '../../screens/User/functional-components/MediaListEmpty';
import BodyContainer from '../common/functional-components/BodyContainer';
import CommonFlatList from '../common/functional-components/CommonFlatList';
import PlayerControlPlayPause from '../common/PlayerControlPlayPause';
import PlayerControlRepeat from '../common/PlayerControlRepeat';
import PlayerControlTimeSeek from '../common/PlayerControlTimeSeek';
import { SongInfoContainer } from '../common/SongInfoContainer';
import SongInfoTitle from '../common/SongInfoTitle';
import Song from '../User/functional-components/Song';
import BasePlayer from './BasePlayer';
import PlayerControl from './PlayerControl';

function cleanImageParams(img: string) {
    if (img.indexOf('hqdefault.jpg') >= 0) {
        return img.replace(/(\?.*)/g, '');
    }
    return img;
}

function cleanTitle(title: string) {
    return title && title.replace('VEVO', '') || '';
}
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
    public playPauseRef: any;
    public seekRef: any;
    public repeatRef: any;

    constructor(props: any) {
        super(props);

        console.log('CONSTRUCTOR', this.player);
        this.toastRef = React.createRef();
        this.flatListRef = React.createRef();
        this.playPauseRef = React.createRef();
        this.seekRef = React.createRef();
        this.repeatRef = React.createRef();

        this.state = {
            currentSong: {},
            tracks: []
        };
    }

    shouldComponentUpdate(prevProps: any, nextProps: any) {
        if (prevProps.tracks &&
            prevProps.tracks.length &&
            nextProps.tracks &&
            nextProps.tracks.length) {
            return true;
        }

        return false;
    }

    componentDidMount() {
        if (this.props.tracks && this.props.tracks.length) {
            this.setState({
                tracks: [...this.props.tracks],
                currentSong: { ...this.props.tracks[0] }
            });
        }
    }

    handleOnPressPlayPause = (paused: boolean) => {
        this.setState({ paused: !paused });
    };

    handleOnPressNextPrev = (track: any) => {
        this.markCurentSong(track);
        this.setIsPlayingPaused(track);
    };

    hanleOnPressRepeat = () => {
        this.setState({
            shouldRepeat: !this.state.shouldRepeat
        });
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

    manageTrack = (track: any, shouldRepeat: boolean) => {
        if (shouldRepeat) {
            return this.setIsPlayingPaused(track);
        }
        const nextPrevIndex = this.state.tracks.length ? track.index + 1 : 0;

        if (this.state.tracks[nextPrevIndex]) {
            this.markCurentSong(this.state.tracks[nextPrevIndex]);
            this.setIsPlayingPaused(this.state.tracks[nextPrevIndex]);
        } else {
            this.markCurentSong(track);
            this.setIsPlayingPaused(track);
        }
    };

    render() {
        const {
            tracks,
            currentSong
        } = this.state;
        const {
            user,
            player,
            repeatRef
        } = this.props;

        if (!Object.keys(currentSong).length) {
            return (<MediaListEmpty />);
        }

        const keyExtractor = (item: any) => item.index.toString();

        return (
            <BodyContainer>
                <SongInfoContainer>
                    <PlayerControl
                        iconStyle={{
                            textAlign: 'center',
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: '#eee',
                            padding: 10,
                            borderRadius: 20,
                            width: 40
                        }}
                        iconType='font-awesome'
                        iconSize={18}
                        action='prev'
                        iconName='step-backward'
                        containerStyle={{ position: 'absolute', top: 20, left: 70, zIndex: 100 }}
                        nextPrevSong={currentSong.index - 1}
                        currentSong={currentSong}
                        tracks={tracks}
                        onPressHandler={(track: any) => {
                            this.handleOnPressNextPrev(track);
                        }}
                    />
                    <PlayerControlRepeat
                        ref={repeatRef}
                        iconStyle={{ borderWidth: 1, borderColor: '#eee', borderRadius: 15, padding: 2, backgroundColor: '#fff' }}
                        action='shouldRepeat'
                        containerStyle={{ position: 'absolute', top: 70, left: 115, zIndex: 100 }}
                    />
                    <PlayerControlPlayPause
                        ref={this.playPauseRef}
                        currentSong={currentSong}
                        tracks={tracks}
                        flatListRef={this.flatListRef}
                        onPressHandler={(flatListItem: any) => {
                            const lastItem = tracks[tracks.length - 1].index === currentSong.index;

                            if (lastItem && this.seekRef.current.trackCurrentTime === 0) {
                                player.current.seek(0);
                            }
                            this.markCurentSong(flatListItem);
                            this.setIsPlayingPaused(flatListItem);
                        }}
                    />
                    <BasePlayer
                        repeatRef={repeatRef}
                        seekRef={this.seekRef}
                        playPauseRef={this.playPauseRef}
                        manageTrack={this.manageTrack}
                        currentSong={currentSong}
                        player={player}
                        tracks={tracks}
                    />
                    <PlayerControl
                        iconStyle={{
                            textAlign: 'center',
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: '#eee',
                            padding: 10,
                            borderRadius: 20,
                            width: 40
                        }}
                        iconType='font-awesome'
                        iconSize={18}
                        action='next'
                        iconName='step-forward'
                        containerStyle={{ position: 'absolute', top: 20, right: 60, zIndex: 100 }}
                        nextPrevSong={currentSong.index + 1}
                        currentSong={currentSong}
                        tracks={tracks}
                        onPressHandler={(track: any) => {
                            this.handleOnPressNextPrev(track);
                        }}
                    />
                    <PlayerControl
                        iconStyle={{ borderWidth: 1, borderColor: '#eee', borderRadius: 15, padding: 5, backgroundColor: '#fff' }}
                        iconType='entypo'
                        iconSize={18}
                        action='full-screen'
                        iconName='resize-full-screen'
                        containerStyle={{ position: 'absolute', top: 70, right: 115, zIndex: 100 }}
                        currentSong={currentSong}
                        tracks={tracks}
                        onPressHandler={() => {
                            player.current.presentFullscreenPlayer();
                        }}
                    />
                    <SongInfoTitle songTitle={currentSong.videoDetails.title} />
                    <PlayerControlTimeSeek
                        ref={this.seekRef}
                        player={player}
                        currentSong={currentSong}
                    />
                </SongInfoContainer>
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
                                    this.playPauseRef.current.onPressHandler(item);
                                    // this.markCurentSong(item);
                                    // this.setIsPlayingPaused(item);
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
