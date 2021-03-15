import React, { memo, useEffect, useState } from 'react';
import Video from 'react-native-video';
import { PlayerControlsContainer } from '../common/PlayerControlsContainer';
import PlayerControlTimeSeek from '../common/PlayerControlTimeSeek';

const BasePlayer = (props: any) => {
    const {
        handleBuffer,
        manageTrack,
        currentSong,
        player
    } = props;

    const [trackCurrentTime, setTrackCurrentTime] = useState(0);

    const handleOnTouchMove = (time: number) => {
        player.current.seek(time);
    };

    const handleOnProgress = (currentTime: number) => {
        console.log('Seeks');
        setTrackCurrentTime(currentTime);
    };

    const handleOnSeek = (currentTime: number) => {
        setTrackCurrentTime(currentTime);
    };

    useEffect(() => {
        setTrackCurrentTime(0);

        return () => { };
    }, [currentSong]);

    return (
        <PlayerControlsContainer>
            <PlayerControlTimeSeek
                trackMaxDuration={currentSong.videoDetails.lengthSeconds}
                currentPosition={trackCurrentTime}
                onTouchMove={handleOnTouchMove}
            />
            <Video
                source={{ uri: currentSong.url }}
                ref={player}
                volume={1.0}
                audioOnly
                muted={false}
                playInBackground
                playWhenInactive
                ignoreSilentSwitch={'ignore'}
                onBuffer={(buffer) => {
                    handleBuffer(buffer.isBuffering);
                }}
                onError={(error) => {
                    console.log('Error', error);
                }}
                onSeek={({ currentTime }) => handleOnSeek(currentTime)}
                paused={!currentSong.isPlaying}
                onLoad={() => {
                    setTrackCurrentTime(0);
                }}
                onLoadStart={() => {
                    setTrackCurrentTime(0);
                }}
                onProgress={({ currentTime, playableDuration }) => handleOnProgress(currentTime)}
                onEnd={() => {
                    console.log('end current song');
                    setTrackCurrentTime(0);
                    manageTrack(currentSong);
                }}
            // repeat={true}
            />
        </PlayerControlsContainer>
    );
};

const areEqual = (prevProps: any, nextProps: any) => {
    if (!prevProps.currentSong.isPlaying && nextProps.currentSong.isPlaying) {
        return false;
    } else if (prevProps.currentSong.index !== nextProps.currentSong.index) {
        return false;
    } else if (!prevProps.currentSong.isPlaying === nextProps.currentSong.isPlaying) {
        return false;
    }
    return true;
};

export default memo(BasePlayer, areEqual);
