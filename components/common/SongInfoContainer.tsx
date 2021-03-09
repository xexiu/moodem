import React from 'react';
import { View } from 'react-native';

const SongInfoContainer = (props: any) => {
    return (
            <View style={{ height: 150 }}>
                {props.children}
            </View>
    );
};

export { SongInfoContainer };
