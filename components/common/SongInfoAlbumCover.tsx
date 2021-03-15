import React, { memo } from 'react';
import { Image, View } from 'react-native';

const SongInfoAlbumCover = (props: any) => {
    const {
        songAlbumCover
    } = props;

    return (
        <View style={{ height: 95, flexDirection: 'row', justifyContent: 'center' }}>
            <Image
                style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: '#ddd' }}
                source={{ uri: songAlbumCover, cache: 'force-cache' }}
            />
        </View>
    );
};

export default memo(SongInfoAlbumCover);
