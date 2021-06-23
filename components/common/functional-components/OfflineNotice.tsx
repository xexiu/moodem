/* eslint-disable global-require */
import React from 'react';
import { Text, View } from 'react-native';
import { btnShadow } from '../../../src/css/styles/common';
import { offlineContainer, offlineText } from '../../../src/css/styles/offlineNotice';
import BgImage from './BgImage';
import PreLoader from './PreLoader';

export const OfflineNotice = () => {
    return (
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
                    }}
                    size={50}
                />
            </View>
        </View>
    );
};
