import React, { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import PreLoader from './functional-components/PreLoader';

const PlayerControlPlayPause = forwardRef((props: any, ref: any) => {
    const {
        currentSong,
        tracks,
        flatListRef,
        player
    } = props;

    const [flatList, setFlatLit] = useState(null);
    const [isBuffering, setIsBuffering] = useState(true);

    useEffect(() => {
        if (!isBuffering) {
            setFlatLit(flatListRef);
        }
    }, [isBuffering, currentSong]);

    useImperativeHandle(ref, () => {
        return {
            setIsBuffering,
            onPressPlay
        };
    }, []);

    const onPressPlay = (song = flatListItem) => {
        player.current.markCurrentSong(song);
        player.current.setAllValues((prevState: any) => {
            return {
                ...prevState,
                currentSong: song
            };
        });
    };

    if (!flatList) {
        return (<PreLoader size={58} containerStyle={{}} />);
    }

    const flatListItem = flatListRef.current._getItem(tracks, currentSong.index);

    if (isBuffering) {
        return (<PreLoader
            size={100}
            containerStyle={{
                position: 'absolute',
                zIndex: 10,
                top: -4,
                borderColor: '#eee',
                width: 110
            }}
            borderWidth={3}
        />);
    }

    console.log('Play/Pause', currentSong.index, 'BasePlayer', player.current);

    return (
        <Icon
            containerStyle={{
                position: 'absolute',
                zIndex: 10,
                top: 35,
                borderWidth: 1,
                borderColor: '#eee',
                borderRadius: 50,
                width: 50
            }}
            Component={TouchableScale}
            name={!flatListItem.isPlaying ? 'play' : 'pause'}
            type={!flatListItem.isPlaying ? 'foundation' : 'AntDesign'}
            size={25}
            color='#dd0031'
            onPress={() => {
                onPressPlay(flatListItem);
            }}
        />
    );
});

export default memo(PlayerControlPlayPause);
