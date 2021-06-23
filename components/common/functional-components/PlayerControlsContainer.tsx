import React from 'react';
import { View } from 'react-native';

const PlayerControlsContainer = (props: any) => {
    return (
        <View
            style={{
                width: 220,
                height: 110,
                position: 'relative',
                alignItems: 'center'
            }}
        >
            {props.children}
        </View>
    );
};

export { PlayerControlsContainer };
