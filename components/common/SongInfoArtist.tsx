import React from 'react';
import { Text, View } from 'react-native';

const SongInfoArtist = (props: any) => {
    const {
        songArtist
    } = props;

    return (
        <View style={{ height: 30, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#777' }} numberOfLines={1}>{songArtist}</Text>
        </View>
    );
};

export { SongInfoArtist };
