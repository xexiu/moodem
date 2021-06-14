import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

function checkLength(songs: any) {
    if (songs) {
        return songs.length >= 100 ? '100+' : songs.length;
    }
    return 0;
}

export const GroupSongsIcon = ({ songs }: any) => {
    return (
        <View style={{ position: 'relative' }}>
            <Icon
                containerStyle={{
                    position: 'absolute',
                    bottom: 12,
                    left: 110,
                    width: 50
                }}
                disabled
                disabledStyle={{ backgroundColor: 'transparent' }}
                name={'my-library-music'}
                type={'FontAwesome'}
                size={15}
                color='#ddd'
            />
            <Text style={{ position: 'absolute', left: 145, top: -27, fontSize: 12 }}>{checkLength(songs)}</Text>
        </View>
    );
};
