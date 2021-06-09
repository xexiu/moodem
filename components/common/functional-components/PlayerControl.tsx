import React, { memo } from 'react';
import { Icon } from 'react-native-elements';

interface MyProps {
    iconStyle: object;
    iconType: string;
    iconSize: number;
    iconName: string;
    containerStyle?: object;
    nextPrevSong: number;
    items: any;
    iconReverse?: boolean;
    iconRaised?: boolean;
    iconColor?: string;
    handleOnClickItem?: Function;
    action: string;
}

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
            onPress={() => {
                return handleOnClickItem(nextPrevSong);
            }}
        />
    );
};

function areEqual(prevState: any, nextState: any) {
    return prevState.nextPrevSong === nextState.nextPrevSong;
}

export default memo(PlayerControl, areEqual);
