import React, { memo, useEffect, useRef } from 'react';
import Video from 'react-native-video';
import { PlayerControlsContainer } from '../common/PlayerControlsContainer';
import PlayerControlTimeSeek from '../common/PlayerControlTimeSeek';

const BasePlayer = (props: any) => {
    const {
        playPauseRef,
        manageTrack,
        currentSong,
        player
    } = props;

    const seekRef = useRef(null);

    useEffect(() => {
        return () => { };
    }, [currentSong]);

    return (
        <PlayerControlsContainer>
            <PlayerControlTimeSeek
                ref={seekRef}
                player={player}
                currentSong={currentSong}
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
                    playPauseRef.current.setIsBuffering(buffer.isBuffering);
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
                    seekRef.current.setTrackCurrentTime(0);
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
