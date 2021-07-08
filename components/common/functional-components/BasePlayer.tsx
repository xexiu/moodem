import { useIsFocused } from '@react-navigation/native';
import { debounce } from 'lodash';
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import MusicControl, { Command } from 'react-native-music-control';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import { AppContext } from '../../User/store-context/AppContext';
import { SongsContext } from '../../User/store-context/SongsContext';

const errorSongs = [] as any;

function configMusicControl() {
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('previousTrack', true);
    MusicControl.enableControl('changePlaybackPosition', true);
    MusicControl.enableBackgroundMode(true);
    MusicControl.handleAudioInterruptions(true);
}

const BasePlayer = (props: any) => {
    const {
        chatRoom,
        repeatRef,
        seekRef,
        playPauseRef,
        item,
        basePlayer,
        handleOnClickItem,
        items,
        indexItem
    } = props;
    const { socket, isServerError } = useContext(AppContext) as any;
    const { dispatchContextSongs } = useContext(SongsContext) as any;
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();
    const toastRef = useRef() as any;

    useEffect(() => {
        if (!item.isSearching) {
            configMusicControl();
            updateSongDetailsOnControlCenter(item);
        } else if (item.isSearching && item.isPlaying) {
            configMusicControl();
            updateSongDetailsOnControlCenter(item);
        } else if (item.isSearching && !item.isPlaying) {
            MusicControl.stopControl();
        }

        if (playPauseRef.current) {
            setIsLoading(false);
        }
        return () => {
            MusicControl.stopControl();
        };
    }, [isFocused, item.isPlaying]);

    const updateSongDetailsOnControlCenter = useCallback((itemToUpdate: any) => {
        MusicControl.setNowPlaying({
            title: itemToUpdate.title,
            artwork: itemToUpdate.thumbnail,
            artist: itemToUpdate.artist,
            duration: Number(itemToUpdate.duration) // (Seconds)
        });
    }, []);

    if (isLoading) {
        return null;
    }

    MusicControl.on(Command.changePlaybackPosition, (playbackPosition) => {
        const currentTime = playbackPosition.replace(/(\.\d+)/g, '');

        seekRef.current.setTrackCurrentTime(Number(currentTime));
        basePlayer.current.seek(Number(currentTime));
    });

    MusicControl.on(Command.play, () => {
        handleOnClickItem(indexItem);
        MusicControl.updatePlayback({
            state: MusicControl.STATE_PLAYING,
            elapsedTime: seekRef.current.trackCurrentTime
        });
    });

    MusicControl.on(Command.pause, () => {
        handleOnClickItem(indexItem);
        MusicControl.updatePlayback({
            state: MusicControl.STATE_PAUSED,
            elapsedTime: seekRef.current.trackCurrentTime
        });
    });

    MusicControl.on(Command.nextTrack, () => {
        const nextPrevIndex = items.length ? indexItem + 1 : 0;

        if (items[nextPrevIndex]) {
            handleOnClickItem(nextPrevIndex);
            updateSongDetailsOnControlCenter(items[nextPrevIndex]);
        }
    });

    MusicControl.on(Command.previousTrack, () => {
        const nextPrevIndex = items.length ? indexItem - 1 : 0;

        if (items[nextPrevIndex]) {
            handleOnClickItem(nextPrevIndex);
            updateSongDetailsOnControlCenter(items[nextPrevIndex]);
        }
    });

    function showPoster() {
        return !item.isPlaying ? item.thumbnail : undefined;
    }

    function handleOnEnd() {
        if (repeatRef.current.shouldRepeat) {
            Object.assign(item, {
                isPlaying: false
            });
            basePlayer.current.seek(0);
            updateSongDetailsOnControlCenter(item);
            return handleOnClickItem(indexItem);
        }
        basePlayer.current.dismissFullscreenPlayer();
        seekRef.current.setTrackCurrentTime(0);

        const nextPrevIndex = items.length ? indexItem + 1 : 0;

        if (items[nextPrevIndex]) {
            updateSongDetailsOnControlCenter(items[nextPrevIndex]);
            return handleOnClickItem(nextPrevIndex);
        }
        return dispatchContextSongs({ type: 'update_song_reset' });
    }

    return (
        <View style={{ flex: 1, width: 100, position: 'relative' }}>
            <Toast
                position={'top'}
                ref={toastRef}
            />
            <Video
                pictureInPicture
                onFullscreenPlayerWillDismiss={() => {
                    return basePlayer.current.setNativeProps({
                        paused: !item.isPlaying
                    });
                }}
                poster={showPoster()}
                posterResizeMode='cover'
                resizeMode='cover'
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 50,
                    borderWidth: 3,
                    borderColor: '#ddd',
                    width: 100,
                    height: 100
                }}
                source={{ uri: convertToProxyURL(item.url) }}
                ref={basePlayer}
                volume={1.0}
                muted={false}
                playInBackground
                playWhenInactive
                ignoreSilentSwitch='ignore'
                onBuffer={(buffer) => {
                    if (playPauseRef.current.isBuffering) {
                        playPauseRef.current.setIsBuffering(buffer.isBuffering);
                    } else if (buffer.isBuffering) {
                        playPauseRef.current.setIsBuffering(buffer.isBuffering);
                    }
                }}
                onLoad={({ currentTime }) => {
                    // This is called after onLoadStart
                    if (!seekRef.current.isSliding) {
                        seekRef.current.setTrackCurrentTime(currentTime);
                        basePlayer.current.seek(currentTime);
                        MusicControl.updatePlayback({
                            elapsedTime: currentTime
                        });
                        Object.assign(errorSongs, []);
                    }
                }}
                onError={({ error }: any) => {
                    toastRef.current.show(error.localizedDescription, 500);
                    if (error.localizedDescription === 'Cannot Decode') {
                        console.error('Song Error -> Cannot Decode', 'Error: ', error);
                        return;
                    }
                    playPauseRef.current.setIsBuffering(true);
                    MusicControl.updatePlayback({
                        state: MusicControl.STATE_ERROR,
                        elapsedTime: 0
                    });
                    seekRef.current.setTrackCurrentTime(0);

                    if (!errorSongs.includes(item.id)) {
                        Object.assign(item, {
                            hasExpired: true
                        });
                        errorSongs.push(item.id);
                        if (!isServerError) {
                            if (item.isSearching) {
                                console.error('Song Error on Searched Songs', 'Error: ', error);
                                return socket.emit('send-song-error', {
                                    chatRoom,
                                    song: item
                                });
                            }
                            console.error('Song Error on Songs', 'Error: ', error);
                            return socket.emit('send-song-error', {
                                chatRoom,
                                song: item
                            });
                        }
                    } else {
                        console.error('Song Error', 'Error: ', error);
                    }
                }}
                paused={!item.isPlaying}
                onProgress={({ currentTime, playableDuration }) => {
                    if (!seekRef.current.isSliding) {
                        MusicControl.updatePlayback({
                            elapsedTime: currentTime
                        });
                        seekRef.current.setTrackCurrentTime(currentTime);
                    }
                }}
                onEnd={debounce(handleOnEnd, 100)}
                repeat={repeatRef.current.shouldRepeat}
            />
        </View>
    );
};

export default memo(BasePlayer);
