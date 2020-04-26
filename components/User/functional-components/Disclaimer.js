/* eslint-disable max-len */
import React from 'react';
import { Icon } from 'react-native-elements';

export const Disclaimer = (props) => {
    const {
        navigation
    } = props;

    return (
        <Icon
            iconStyle={{ alignSelf: 'flex-end', marginTop: -20, marginRight: 5, paddingBottom: 2 }}
            name='exclamationcircleo'
            type='antdesign'
            color='#000'
            size={24}
            onPress={() => navigation.navigate('Disclaimer')}
        />
    );
};
