import { useIsFocused } from '@react-navigation/native';
import debounce from 'lodash.debounce';
import React, { memo, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import MusicControl, { Command } from 'react-native-music-control';
import Video from 'react-native-video';
import { AppContext } from '../../User/store-context/AppContext';
import { SongsContext } from '../../User/store-context/SongsContext';

function updateSongDetailsOnControlCenter(item: any) {
    MusicControl.setNowPlaying({
        title: item.videoDetails.title,
        artwork: item.videoDetails.thumbnails[0].url,
        artist: item.videoDetails.media.artist,
        duration: Number(item.videoDetails.lengthSeconds) // (Seconds)
    });
}

function configMusicControl() {
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('previousTrack', true);
    MusicControl.enableControl('changePlaybackPosition', true);
    MusicControl.handleAudioInterruptions(true);
}

const BasePlayer = (props: any) => {
    const {
        repeatRef,
        seekRef,
        playPauseRef,
        item,
        basePlayer,
        handleOnClickItem,
        items
    } = props;
    const isFocused = useIsFocused();
    const { group, socket } = useContext(AppContext) as any;
    const { dispatchContextSongs } = useContext(SongsContext) as any;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        configMusicControl();

        if (playPauseRef.current) {
            setIsLoading(false);
        }
        return () => { };
    }, [isFocused]);

    if (isLoading) {
        return null;
    }

    MusicControl.on(Command.changePlaybackPosition, (playbackPosition) => {
        const currentTime = playbackPosition.replace(/(\.\d+)/g, '');

        seekRef.current.setTrackCurrentTime(Number(currentTime));
        basePlayer.current.seek(Number(currentTime));
    });

    MusicControl.on(Command.play, () => {
        handleOnClickItem(item.id);
        MusicControl.updatePlayback({
            state: MusicControl.STATE_PLAYING,
            elapsedTime: seekRef.current.trackCurrentTime
        });
    });

    MusicControl.on(Command.pause, () => {
        handleOnClickItem(item.id);
        MusicControl.updatePlayback({
            state: MusicControl.STATE_PAUSED,
            elapsedTime: seekRef.current.trackCurrentTime
        });
    });

    MusicControl.on(Command.nextTrack, () => {
        const nextPrevIndex = items.length ? item.id + 1 : 0;

        if (items[nextPrevIndex]) {
            handleOnClickItem(items[nextPrevIndex].id);
            updateSongDetailsOnControlCenter(items[nextPrevIndex]);
        }
    });

    MusicControl.on(Command.previousTrack, () => {
        const nextPrevIndex = items.length ? item.id - 1 : 0;

        if (items[nextPrevIndex]) {
            handleOnClickItem(items[nextPrevIndex].id);
            updateSongDetailsOnControlCenter(items[nextPrevIndex]);
        }
    });

    function showPoster() {
        return !item.isPlaying ? item.videoDetails.thumbnails[0].url : undefined;
    }

    function handleOnEnd() {
        if (repeatRef.current.shouldRepeat) {
            Object.assign(item, {
                isPlaying: false
            });
            basePlayer.current.seek(0);
            updateSongDetailsOnControlCenter(item);
            return handleOnClickItem(item.id);
        }
        basePlayer.current.dismissFullscreenPlayer();
        seekRef.current.setTrackCurrentTime(0);

        const nextPrevIndex = items.length ? item.id + 1 : 0;

        if (items[nextPrevIndex]) {
            updateSongDetailsOnControlCenter(items[nextPrevIndex]);
            return handleOnClickItem(items[nextPrevIndex].id);
        }
        return dispatchContextSongs({ type: 'update_song_reset' });
    }

    return (
        <View style={{ flex: 1, width: 100, position: 'relative' }}>
            <Video
                pictureInPicture
                onFullscreenPlayerWillDismiss={() => {
                    basePlayer.current.setNativeProps({
                        paused: !item.isPlaying
                    });
                }}
                poster={showPoster()}
                posterResizeMode='cover'
                resizeMode='cover'
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    width: 100,
                    height: 100
                }}
                source={{ uri: item.url }}
                ref={basePlayer}
                volume={1.0}
                muted={false}
                playInBackground
                playWhenInactive
                ignoreSilentSwitch='ignore'
                onBuffer={(buffer) => {
                    playPauseRef.current.setIsBuffering(buffer.isBuffering);
                    MusicControl.updatePlayback({
                        elapsedTime: 0
                    });
                }}
                onLoad={({ currentTime }) => {
                    if (!seekRef.current.isSliding) {
                        seekRef.current.setTrackCurrentTime(0);
                    }
                    basePlayer.current.seek(0);
                }}
                onLoadStart={() => {
                    if (!seekRef.current.isSliding) {
                        seekRef.current.setTrackCurrentTime(0);
                        updateSongDetailsOnControlCenter(item);
                    }
                    basePlayer.current.seek(0);
                }}
                onError={(error) => {
                    // Send Error to Sentry
                    playPauseRef.current.setIsBuffering(true);
                    MusicControl.updatePlayback({
                        state: MusicControl.STATE_ERROR,
                        elapsedTime: 0
                    });
                    console.log('Song Error', error);
                    socket.emit('send-song-error', { chatRoom: group.group_name, song: item });
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
