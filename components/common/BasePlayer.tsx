import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import PreLoader from '../../components/common/functional-components/PreLoader';

function cleanImageParams(img: string) {
    if (img.indexOf('hqdefault.jpg') >= 0) {
        return img.replace(/(\?.*)/g, '');
    }
    return img;
}

function showPoster(currentSong: any) {
    return !currentSong.isPlaying ? cleanImageParams(currentSong.videoDetails.thumbnails[0].url) : undefined;
}

const BasePlayer = (props: any) => {
    const {
        repeatRef,
        seekRef,
        playPauseRef,
        manageTrack,
        currentSong,
        player
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (player.current) {
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

    return (
        <View style={{ flex: 1, width: 100, position: 'relative' }}>
            <Video
                onFullscreenPlayerWillDismiss={() => player.current.seek(seekRef.current.trackCurrentTime)}
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
                ref={player}
                volume={1.0}
                muted={false}
                playInBackground
                playWhenInactive
                ignoreSilentSwitch={'ignore'}
                onBuffer={(buffer) => {
                    playPauseRef.current.setIsBuffering(buffer.isBuffering);
                }}
                onLoad={({ currentTime }) => {
                    if (!seekRef.current.isSliding) {
                        seekRef.current.setTrackCurrentTime(0);
                    }
                    player.current.seek(0);
                }}
                onLoadStart={() => {
                    if (!seekRef.current.isSliding) {
                        seekRef.current.setTrackCurrentTime(0);
                    }
                    player.current.seek(0);
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
                        player.current.seek(0);
                    }
                    player.current.dismissFullscreenPlayer();
                    seekRef.current.setTrackCurrentTime(0);
                    manageTrack(currentSong, repeatRef.current.shouldRepeat);
                }}
                repeat={repeatRef.current.shouldRepeat}
            />
        </View>
    );
};

const areEqual = (prevProps: any, nextProps: any) => {
    if (!prevProps.currentSong.isPlaying && nextProps.currentSong.isPlaying) {
        return false;
    } else if (prevProps.currentSong.index !== nextProps.currentSong.index) {
        return false;
    } else if (!prevProps.currentSong.isPlaying === nextProps.currentSong.isPlaying) {
        return false;
    } else if (nextProps.tracks[nextProps.tracks.length - 1].index === nextProps.currentSong.index) {
        return false;
    }
    return true;
};

export default memo(BasePlayer, areEqual);
