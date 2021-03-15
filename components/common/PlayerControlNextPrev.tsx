import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

const PlayerControlNextPrev = (props: any) => {
    const {
        action,
        nextPrevSong,
        tracks,
        onPressHandler
    } = props;

    return (
        <Icon
            disabled={!tracks[nextPrevSong]}
            Component={TouchableScale}
            raised
            name={action === 'prev' ? 'step-backward' : 'step-forward'}
            type='font-awesome'
            color='#777'
            size={18}
            onPress={() => {
                if (tracks[nextPrevSong]) {
                    return onPressHandler(tracks[nextPrevSong]);
                }
            }}
        />
    );
};

const areEqual = (prevProps: any, nextProps: any) => {
    if (prevProps.currentSong.index !== nextProps.currentSong.index &&
        prevProps.action === 'next' && prevProps.action === 'next') {
        return false;
    } else if (prevProps.action === 'prev' && prevProps.action === 'prev') {
        return false;
    }
    return true;
};

export default memo(PlayerControlNextPrev, areEqual);
