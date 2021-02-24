import React from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export const PlayerControlForward = (props: any) => {

    const {
        onPressForward
    } = props;

    return (
        <Icon
            Component={TouchableScale}
            raised
            name='step-forward'
            type='font-awesome'
            color='#777'
            size={18}
            onPress={() => {
                onPressForward();
            }} />
    );
};
