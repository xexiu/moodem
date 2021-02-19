import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { defaultPreLoaderStyles } from '../../../src/css/styles/preLoader';

type AppProps = {
    size?: number;
    containerStyle?: object
};

const PreLoader = ({ size = 30, containerStyle }: AppProps) => {

    return (
        <View style={[defaultPreLoaderStyles, containerStyle]}>
            <Progress.Circle size={size} indeterminate color={'#dd0031'} />
        </View>
    );
};

PreLoader.propTypes = {
    size: PropTypes.number,
    containerStyle: PropTypes.object
};

memo(PreLoader);

export {
    PreLoader
};
