/* eslint-disable max-len, global-require */
import React from 'react';
import { View } from 'react-native';
import { BgImage } from '../../../components/common/BgImage';

export const GuestScreen = (props) => (
    <View style={{ alignItems: 'center' }}>
        <BgImage source={require('../../../assets/images/logo_moodem.png')} />
        {props.children}
    </View>
);
