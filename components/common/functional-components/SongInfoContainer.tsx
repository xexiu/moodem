import React from 'react';
import { View } from 'react-native';

const SongInfoContainer = (props: any) => {
    return (
        <View style={{ height: 190, justifyContent: 'center', alignItems: 'center' }}>
            {props.children}
        </View>
    );
};

export { SongInfoContainer };
