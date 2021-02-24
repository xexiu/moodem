import React from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export const PlayerControlBackward = (props: any) => {
    const {
        onPressBackward
    } = props;

    return (
        <Icon
            Component={TouchableScale}
            raised
            name='step-backward'
            type='font-awesome'
            color='#777'
            size={18}
            onPress={() => {
                onPressBackward();
            }}
        />
    );
};
