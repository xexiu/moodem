import React, { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import PreLoader from './functional-components/PreLoader';

const PlayerControlPlayPause = forwardRef((props: any, ref: any) => {
    const {
        currentSong,
        tracks,
        flatListRef,
        onPressHandler
    } = props;

    const [flatList, setFlatLit] = useState(null);
    const [isBuffering, setIsBuffering] = useState(false);

    useEffect(() => {
        setFlatLit(flatListRef);
    }, []);

    useImperativeHandle(ref, () => {
        return {
            setIsBuffering,
            onPressHandler
        };
    }, [isBuffering]);

    if (!flatList) {
        return (<PreLoader size={58} containerStyle={{}} />);
    }

    const flatListItem = flatList.current._getItem(tracks, currentSong.index);

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
            onPress={() => onPressHandler(flatListItem)}
        />
    );
});

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

export default memo(PlayerControlPlayPause, areEqual);
