import React from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import PreLoader from './functional-components/PreLoader';

export const PlayerControlPlayPause = (props: any) => {
    const {
        paused,
        onPressPlayPause,
        songIsReady
    } = props;

    if (songIsReady) {
        return (
            <Icon
                Component={TouchableScale}
                raised
                name={paused ? 'play' : 'pause'}
                type={paused ? 'foundation' : 'AntDesign'}
                size={25}
                color='#dd0031'
                onPress={() => onPressPlayPause(paused)}
            />
        );
    }

    return (<PreLoader size={58} containerStyle={{}} />);
};
