import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';

const BasePlayer = (props: any) => {
    const {
        repeatRef,
        seekRef,
        playPauseRef,
        item,
        basePlayer,
        onClick,
        items
    } = props;
    const isFocused = useIsFocused();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (playPauseRef.current) {
            setIsLoading(false);
        }
        return () => {};
    }, [isFocused]);

    if (isLoading) {
        return null;
    }

    function showPoster() {
        return !item.isPlaying ? item.videoDetails.thumbnails[0].url : undefined;
    }

    function handleOnEnd() {
        if (repeatRef.current.shouldRepeat) {
            Object.assign(item, {
                isPlaying: false
            });
            basePlayer.current.seek(0);
            return onClick(item.id);
        }
        basePlayer.current.dismissFullscreenPlayer();
        seekRef.current.setTrackCurrentTime(0);

        const nextPrevIndex = items.length ? item.id + 1 : 0;

        if (items[nextPrevIndex]) {
            return onClick(items[nextPrevIndex].id);
        } else {
            return onClick(item.id);
        }
    }

    return (
        <View style={{ flex: 1, width: 100, position: 'relative' }}>
            <Video
                onFullscreenPlayerWillDismiss={() => {
                    basePlayer.current.setNativeProps({
                        paused: !item.isPlaying
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
                source={{ uri: item.url }}
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
                paused={!item.isPlaying}
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