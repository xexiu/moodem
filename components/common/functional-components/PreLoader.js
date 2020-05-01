import React from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';

export const PreLoader = (props) => {
    const {
        size = 30,
        containerStyle = { justifyContent: 'center', alignItems: 'center' }
    } = props;

    return (
        <View style={[{ marginTop: 4, paddingLeft: 5, paddingRight: 5 }, containerStyle]}>
            <Progress.Circle size={size} indeterminate color={'#dd0031'} />
        </View>
    );
};
