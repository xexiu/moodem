import React, { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { Icon } from 'react-native-elements';

const PlayerControlRepeat = forwardRef((props: any, ref: any) => {
    const {
        iconStyle,
        containerStyle
    } = props;

    const [shouldRepeat, setShouldRepeat] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            setShouldRepeat,
            shouldRepeat
        };
    }, [shouldRepeat]);

    return (
        <Icon
            containerStyle={[containerStyle]}
            iconStyle={iconStyle}
            name={shouldRepeat ? 'repeat-one' : 'repeat'}
            type='MaterialIcons'
            color='#dd0031'
            size={25}
            onPress={() => {
                setShouldRepeat(!shouldRepeat);
            }}
        />
    );
});

const areEqual = (prevProps: any, nextProps: any) => {
    return true;
};

export default memo(PlayerControlRepeat, areEqual);
