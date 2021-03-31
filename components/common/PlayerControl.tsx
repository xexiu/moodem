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
        tracks,
        onPressHandler,
        action
    } = props;

    return (
        <Icon
            containerStyle={[containerStyle]}
            disabled={action !== 'full-screen' && tracks && !tracks[nextPrevSong]}
            raised={iconRaised}
            reverse={iconReverse}
            iconStyle={iconStyle}
            name={iconName}
            type={iconType}
            color={action !== 'full-screen' && tracks && !tracks[nextPrevSong] ? '#777' : iconColor}
            size={iconSize}
            onPress={() => {
                if (tracks && tracks[nextPrevSong]) {
                    return onPressHandler(tracks[nextPrevSong]);
                }
                return onPressHandler();
            }}
        />
    );
};

const areEqual = (prevProps: any, nextProps: any) => {
    // if (prevProps.currentSong.index !== nextProps.currentSong.index &&
    //     prevProps.action === 'next' && prevProps.action === 'next') {
    //     return false;
    // }
    // if (prevProps.currentSong.index !== nextProps.currentSong.index &&
    //     prevProps.action === 'prev' && prevProps.action === 'prev') {
    //     return false;
    // }
    return false;
};

export default memo(PlayerControl, areEqual);
