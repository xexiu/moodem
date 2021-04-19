import React, { memo } from 'react';
import { Icon } from 'react-native-elements';

type MyProps = {
    iconReverse: boolean,
    iconRaised: boolean,
    iconType: string,
    iconSize: number,
    iconName: string,
    iconStyle: object,
    iconColor: string,
    containerStyle: object,
    nextPrevSong: number,
    item: any,
    items: any,
    handleOnClickItem: Function,
    action: string
};

const PlayerControl = (props: MyProps) => {
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
        items,
        handleOnClickItem
    } = props;

    return (
        <Icon
            containerStyle={[containerStyle]}
            disabled={items && !items[nextPrevSong]}
            raised={iconRaised}
            reverse={iconReverse}
            iconStyle={iconStyle}
            name={iconName}
            type={iconType}
            color={items && !items[nextPrevSong] ? '#777' : iconColor}
            size={iconSize}
            onPress={() => handleOnClickItem(items[nextPrevSong].id)}
        />
    );
};

export default memo(PlayerControl);
