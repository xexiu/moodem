import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import PreLoader from '../../components/common/functional-components/PreLoader';

function showPoster(currentSong: any) {
    return !currentSong.isPlaying ? currentSong.videoDetails.thumbnails[0].url : undefined;
}

const BasePlayer = (props: any) => {
    const {
        repeatRef,
        seekRef,
        playPauseRef,
        manageTrack,
        currentSong,
        basePlayer
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (repeatRef.current) {
            setIsLoading(false);
        }
        return () => { };
    }, [currentSong]);

    if (isLoading) {
        return (
            <PreLoader
                containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                size={50}
            />
        );
    }

    console.log('BasePlayer', currentSong.index);

    return (
        <View style={{ flex: 1, width: 100, position: 'relative' }}>
            <Video
                onFullscreenPlayerWillDismiss={() => {
                    basePlayer.current.setNativeProps({
                        paused: !currentSong.isPlaying
                    });
                }}
                poster={showPoster(currentSong)}
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
                    if (!buffer.isBuffering) {
                        playPauseRef.current.setIsBuffering(buffer.isBuffering);
                    }
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
                    console.log('end current song');
                    if (repeatRef.current.shouldRepeat) {
                        basePlayer.current.seek(0);
                    }
                    basePlayer.current.dismissFullscreenPlayer();
                    seekRef.current.setTrackCurrentTime(0);
                    manageTrack(currentSong, repeatRef.current.shouldRepeat);
                }}
                repeat={repeatRef.current.shouldRepeat}
            />
        </View>
    );
};

const areEqual = (prevProps: any, nextProps: any) => {
    // console.log('Base Player prev', prevProps, 'Next', nextProps);
    return false;
    // if (!prevProps.currentSong.isPlaying && nextProps.currentSong.isPlaying) {
    //     return false;
    // } else if (prevProps.currentSong.index !== nextProps.currentSong.index) {
    //     return false;
    // } else if (!prevProps.currentSong.isPlaying === nextProps.currentSong.isPlaying) {
    //     return false;
    // } else if (nextProps.tracks[nextProps.tracks.length - 1].index === nextProps.currentSong.index &&
    //     !nextProps.repeatRef.current.shouldRepeat) {
    //     return false;
    // }
    // return true;
};

export default memo(BasePlayer, areEqual);
