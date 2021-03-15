import React from 'react';
import { View } from 'react-native';

const PlayerControlsContainer = (props: any) => {
    return (
        <View
            style={{
                height: 40,
                justifyContent: 'center',
                flexDirection: 'row',
                marginTop: 10
            }}
        >
            {props.children}
        </View>
    );
};

export { PlayerControlsContainer };
