import React, { memo } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { defaultPreLoaderStyles } from '../../../src/css/styles/preLoader';

export const PreLoader = memo((props) => {
    const {
        size = 30,
        containerStyle
    } = props;

    return (
        <View style={[defaultPreLoaderStyles, containerStyle]}>
            <Progress.Circle size={size} indeterminate color={'#dd0031'} />
        </View>
    );
});
