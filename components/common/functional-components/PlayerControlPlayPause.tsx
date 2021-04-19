import React, { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import PreLoader from './PreLoader';

const PlayerControlPlayPause = forwardRef((props: any, ref: any) => {
    const {
        isPlaying,
        item,
        handleOnClickItem
    } = props;

    const [isBuffering, setIsBuffering] = useState(true);

    useImperativeHandle(ref, () => {
        return {
            isBuffering,
            setIsBuffering
        };
    }, [isBuffering]);

    if (isBuffering) {
        return (<PreLoader
            size={100}
            containerStyle={{
                position: 'absolute',
                zIndex: 10,
                top: -4,
                borderColor: '#eee',
                width: 110
            }}
        />);
    }

    return (
        <Icon
            containerStyle={{
                position: 'absolute',
                zIndex: 10,
                top: 35,
                borderWidth: 1,
                borderColor: '#eee',
                borderRadius: 50,
                width: 50
            }}
            Component={TouchableScale}
            name={!isPlaying ? 'play' : 'pause'}
            type={!isPlaying ? 'foundation' : 'AntDesign'}
            size={25}
            color='#dd0031'
            onPress={() => {
                return handleOnClickItem(item.id);
            }}
        />
    );
});

export default memo(PlayerControlPlayPause);
