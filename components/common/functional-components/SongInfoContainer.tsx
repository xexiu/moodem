import React from 'react';
import { View } from 'react-native';

const SongInfoContainer = (props: any) => {
    return (
        <View
            style={{
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                marginBottom: 5
            }}
        >
            {props.children}
        </View>
    );
};

export { SongInfoContainer };
