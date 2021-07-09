import React, { memo } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { defaultPreLoaderStyles } from '../../../src/css/styles/preLoader';

type Props = {
    size?: number;
    containerStyle?: object,
    borderWidth?: number,
    name?: string,
    color?: string,
    progress?: number
};

function buildProgress(props: any) {
    switch (props.name) {
    case 'bar':
        return <Progress.Bar {...props} />;
    case 'pie':
        return <Progress.Pie {...props} />;
    default:
        return <Progress.Circle {...props} indeterminate={true} />;
    }
}

const PreLoader = ({ size = 30, containerStyle, borderWidth = 1, name, color= '#dd0031', progress = 0.4 }: Props) => {

    return (
        <View style={[defaultPreLoaderStyles, containerStyle]}>
            {buildProgress({ size, containerStyle, borderWidth, name, color, progress })}
        </View>
    );
};

export default memo(PreLoader);
