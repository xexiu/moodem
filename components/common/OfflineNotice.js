/* eslint-disable global-require */
import React from 'react';
import { View, Text } from 'react-native';
import { BgImage } from './functional-components/BgImage';
import { offlineContainer, offlineText } from '../../src/css/styles/offlineNotice';
import { btnShadow } from '../../src/css/styles/common';

export const OfflineNotice = () => (
    <View>
        <View style={[offlineContainer, btnShadow]}>
            <Text style={offlineText}>No Internet Connection</Text>
        </View>
        <View style={{ marginTop: 30 }}>
            <BgImage source={require('../../assets/images/logo_moodem.png')} />
        </View>
    </View>
);
