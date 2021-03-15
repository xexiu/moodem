import React, { memo, useEffect, useState } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import PreLoader from './functional-components/PreLoader';

const PlayerControlPlayPause = (props: any) => {
    const {
        isBuffering,
        currentSong,
        tracks,
        flatListRef,
        onPressHandler
    } = props;

    const [flatList, setFlatLit] = useState(null);

    useEffect(() => {
        setFlatLit(flatListRef);
    }, []);

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
};

const areEqual = (prevProps: any, nextProps: any) => {
    if (!prevProps.isBuffering && !nextProps.isBuffering &&
        !prevProps.currentSong.isPlaying && nextProps.currentSong.isPlaying) {
        return false;
    }

};

export default memo(PlayerControlPlayPause, areEqual);
