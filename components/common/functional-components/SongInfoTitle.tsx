import React, { memo } from 'react';
import { Text, View } from 'react-native';

const SongInfoTitle = (props: any) => {
    const {
        songTitle
    } = props;

    return (
        <View style={{ minHeight: 30, justifyContent: 'center', alignItems: 'center' }}>
            <Text
                style={{ color: '#dd0031', fontSize: 22, textAlign: 'center' }}
                numberOfLines={1}
            >
                {songTitle}
            </Text>
        </View>
    );
};

export default memo(SongInfoTitle);
