import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import Button from '../../../components/User/functional-components/Button';

function checkLength(songs: any) {
    if (songs) {
        return songs.length >= 100 ? '100+' : songs.length;
    }
    return 0;
}

export const GroupSongsIcon = ({ songs }: any) => {
    return (
        <Button
            containerStyle={{ marginRight: 7, marginTop: 10 }}
            textStyle={{ fontSize: 12, paddingRight: 10, marginTop: 10 }}
            disabled
            disabledStyle={{ backgroundColor: 'transparent' }}
            iconReverse={false}
            iconName={'my-library-music'}
            iconType={'FontAwesome'}
            iconColor='#ddd'
            iconSize={15}
            text={checkLength(songs)}
        />
    );
};
