import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
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
            setIsBuffering
        };
    }, [isBuffering]);

    if (!flatList) {
        return (<PreLoader size={58} containerStyle={{}} />);
    }

    const flatListItem = flatList.current._getItem(tracks, currentSong.index);

    if (isBuffering) {
        return (<PreLoader size={58} containerStyle={{}} />);
    }

    return (
        <Icon
            Component={TouchableScale}
            raised
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
    }
    return true;

};

export default memo(PlayerControlPlayPause, areEqual);
