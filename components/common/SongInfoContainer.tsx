import React from 'react';
import { View } from 'react-native';

const SongInfoContainer = (props: any) => {
    return (
            <View style={{ height: 160 }}>
                {props.children}
            </View>
    );
};

export { SongInfoContainer };
