import React, { memo } from 'react';
import { Icon } from 'react-native-elements';

const PlayerControl = (props: any) => {
    const {
        iconReverse = false,
        iconRaised = false,
        iconType,
        iconSize,
        iconName,
        iconStyle,
        iconColor = '#dd0031',
        containerStyle,
        nextPrevSong,
        songs,
        onPressHandler,
        action
    } = props;

    return (
        <Icon
            containerStyle={[containerStyle]}
            disabled={action !== 'full-screen' && songs && !songs[nextPrevSong]}
            raised={iconRaised}
            reverse={iconReverse}
            iconStyle={iconStyle}
            name={iconName}
            type={iconType}
            color={action !== 'full-screen' && songs && !songs[nextPrevSong] ? '#777' : iconColor}
            size={iconSize}
            onPress={() => {
                if (songs && songs[nextPrevSong]) {
                    return onPressHandler(songs[nextPrevSong]);
                }
                return onPressHandler();
            }}
        />
    );
};

const areEqual = (prevProps: any, nextProps: any) => {
    if (prevProps.currentSong.id !== nextProps.currentSong.id &&
        prevProps.action === 'next' && prevProps.action === 'next') {
        return false;
    }
    if (prevProps.currentSong.id !== nextProps.currentSong.id &&
        prevProps.action === 'prev' && prevProps.action === 'prev') {
        return false;
    }
    return true;
};

export default memo(PlayerControl, areEqual);
