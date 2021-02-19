import React from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export const PlayerControlPlayPause = props => {
    const {
        isPlaying,
        onPressPlayPause
    } = props;

    return (
        <Icon
            Component={TouchableScale}
            raised
            name={isPlaying ? 'pause' : 'play'}
            type={isPlaying ? 'AntDesign' : 'foundation'}
            size={25}
            color='#dd0031'
            onPress={() => onPressPlayPause(isPlaying)}
        />
    );
};
