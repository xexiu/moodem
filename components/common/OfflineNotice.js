/* eslint-disable global-require */
import React from 'react';
import { View, Text } from 'react-native';
import { BgImage } from './functional-components/BgImage';
import { offlineContainer, offlineText } from '../../src/css/styles/offlineNotice';
import { btnShadow } from '../../src/css/styles/common';
import { PreLoader } from './functional-components/PreLoader';

export const OfflineNotice = () => (
    <View>
        <View style={[offlineContainer, btnShadow]}>
            <Text style={offlineText}>No Internet Connection</Text>
        </View>
        <View>
            <BgImage />
            <PreLoader
                containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }} size={50}
            />
        </View>
    </View>
);
