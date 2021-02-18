/* eslint-disable max-len */
import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

export const Privacy = (props) => {
    const {
        navigation
    } = props;

    return (
        <View style={{ position: 'absolute', right: 5, width: 30, top: 0, height: 40 }}>
            <Icon
                iconStyle={{ alignSelf: 'flex-end', position: 'relative', marginTop: 5 }}
                name='exclamationcircleo'
                type='antdesign'
                color='#000'
                size={24}
                onPress={() => navigation.navigate('Privacy')}
            />
        </View>
    );
};
