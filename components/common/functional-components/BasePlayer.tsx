import { useIsFocused } from '@react-navigation/native';
import React, { memo, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import { AppContext } from '../../User/store-context/AppContext';
import { SongsContext } from '../../User/store-context/SongsContext';

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
        if (playPauseRef.current) {
            setIsLoading(false);
        }
        return () => { };
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
            return handleOnClickItem(item.id);
        }
        basePlayer.current.dismissFullscreenPlayer();
        seekRef.current.setTrackCurrentTime(0);

        const nextPrevIndex = items.length ? item.id + 1 : 0;

        if (items[nextPrevIndex]) {
            return handleOnClickItem(items[nextPrevIndex].id);
        } else {
            dispatchContextSongs({ type: 'update_song_reset' });
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
                    // Send Error to Sentry
                    console.log('Song Error', error);
                    socket.emit('send-song-error', { chatRoom: group.group_name, song: item });
                }}
                paused={!item.isPlaying}
                onProgress={({ currentTime, playableDuration }) => {
                    if (!seekRef.current.isSliding) {
                        seekRef.current.setTrackCurrentTime(currentTime);
                    }
                }}
                onEnd={handleOnEnd}
                repeat={repeatRef.current.shouldRepeat}
            />
        </View>
    );
};

export default memo(BasePlayer);
