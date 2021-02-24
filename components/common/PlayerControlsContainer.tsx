import React from 'react';
import { View } from 'react-native';

const PlayerControlsContainer = (props: any) => {
    return (
        <View style={{ height: 120, justifyContent: 'center', flexDirection: 'row' }}>
            {props.children}
        </View>
    );
};

export { PlayerControlsContainer };
