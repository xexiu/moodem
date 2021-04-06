import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';

const BasePlayer = (props: any, ref: any) => {
    const {
        repeatRef,
        seekRef,
        playPauseRef,
        currentSong,
        basePlayer,
        songs,
        songsListRef
    } = props;
    const isFocused = useIsFocused();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (songsListRef.current) {
            setIsLoading(false);
        }
        return () => {};
    }, [isFocused]);

    if (isLoading) {
        return null;
    }

    function showPoster() {
        return !currentSong.isPlaying ? currentSong.videoDetails.thumbnails[0].url : undefined;
    }

    function handleOnEnd() {
        if (repeatRef.current.shouldRepeat) {
            basePlayer.current.seek(0);
            return songsListRef.current.setAllValues((prevValues: any) => {
                return {
                    ...prevValues,
                    currentSong
                };
            });
        }
        basePlayer.current.dismissFullscreenPlayer();
        seekRef.current.setTrackCurrentTime(0);

        const nextPrevIndex = songs.length ? currentSong.id + 1 : 0;

        if (songs[nextPrevIndex]) {
            return songsListRef.current.handlePressItem(songs[nextPrevIndex]);
        } else {
            return songsListRef.current.handlePressItem(currentSong);
        }
    }

    return (
        <View style={{ flex: 1, width: 100, position: 'relative' }}>
            <Video
                onFullscreenPlayerWillDismiss={() => {
                    basePlayer.current.setNativeProps({
                        paused: !currentSong.isPlaying
                    });
                }}
                poster={showPoster()}
                audioOnly={true}
                posterResizeMode='cover'
                resizeMode='cover'
                style={{
                    borderRadius: 50, borderWidth: 1, borderColor: '#ddd',
                    width: 100,
                    height: 100,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }}
                source={{ uri: currentSong.url }}
                ref={basePlayer}
                volume={1.0}
                muted={false}
                playInBackground
                playWhenInactive
                ignoreSilentSwitch='ignore'
                onBuffer={(buffer) => {
                    playPauseRef.current.setIsBuffering(buffer.isBuffering);
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
                    }
                    basePlayer.current.seek(0);
                }}
                onError={(error) => {
                    console.log('Error', error);
                }}
                paused={!currentSong.isPlaying}
                onProgress={({ currentTime, playableDuration }) => {
                    if (!seekRef.current.isSliding) {
                        seekRef.current.setTrackCurrentTime(currentTime);
                    }
                }}
                onEnd={() => {
                    return handleOnEnd();
                }}
                repeat={repeatRef.current.shouldRepeat}
            />
        </View>
    );
};

const areEqual = (prevProps: any, nextProps: any) => {
    if (nextProps.isComingFromSearchingSong || nextProps.isRemovingSong) {
        return true;
    }
    return false;
};

export default memo(BasePlayer, areEqual);
