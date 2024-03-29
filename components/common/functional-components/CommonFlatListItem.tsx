import React, { memo } from 'react';
import { ListItem } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import TouchableScale from 'react-native-touchable-scale';
import { isEmpty } from '../../../src/js/Utils/common/checkers';

const DEFAULT_AVATAR_STYLE = { width: 50, height: 50, borderRadius: 5, borderColor: '#ddd', borderWidth: 1 };
const DEFAULT_CONTAINER_STYLE = {
    position: 'relative',
    padding: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 1
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2
};

type PropsCommonFlatList = {
    title: string,
    titleStyle?: object,
    subtitle?: string | number,
    subtitleStyle?: object,
    leftAvatar?: any,
    bottomDivider?: boolean,
    rightTitle?: string,
    action?: any,
    topDivider?: boolean,
    titleProps?: object,
    contentContainerStyle?: string[] | object,
    chevron?: any,
    avatarStyle?: object,
    buttonGroup?: any,
    friction?: number,
    tension?: number,
    customView?: any,
    subTitleProps?: any,
    disabled?: boolean
};

const CommonFlatListItem = (props: PropsCommonFlatList) => {
    const {
        title,
        titleStyle,
        titleProps,
        subtitle,
        subtitleStyle,
        subTitleProps,
        topDivider,
        disabled = false,
        rightTitle,
        contentContainerStyle = DEFAULT_CONTAINER_STYLE,
        leftAvatar,
        bottomDivider,
        chevron,
        action,
        avatarStyle = DEFAULT_AVATAR_STYLE,
        buttonGroup,
        friction = 90,
        tension = 200,
        customView
    } = props;

    const myAvatar = (<FastImage
        style={avatarStyle}
        source={{
            uri: leftAvatar?.source.uri,
            priority: FastImage.priority.high
        }}
    />);

    return (
        <ListItem
            Component={TouchableScale}
            friction={friction}
            tension={tension}
            containerStyle={contentContainerStyle}
            topDivider={topDivider}
            bottomDivider={bottomDivider}
            disabled={disabled}
            onPress={action}
        >
            {leftAvatar && myAvatar}
            <ListItem.Content>
                <ListItem.Title {...titleProps} style={titleStyle}>{title}</ListItem.Title>
                {customView}
                <ListItem.Subtitle {...subTitleProps} style={subtitleStyle}>{subtitle}</ListItem.Subtitle>
            </ListItem.Content>
            {buttonGroup && <ListItem.ButtonGroup
                innerBorderStyle={{ width: 0 }}
                buttons={buttonGroup}
                onPress={buttonGroup.action}
                containerStyle={{
                    borderWidth: 0,
                    height: 40,
                    position: 'absolute',
                    bottom: -4,
                    right: 0,
                    paddingRight: 0,
                    backgroundColor: 'transparent'
                }}
            >
            </ListItem.ButtonGroup>
            }
            {!isEmpty(chevron) &&
                <ListItem.Chevron
                    name={chevron.name ? chevron.name : 'check'}
                    type={chevron.type ? chevron.type : 'AntDesign'}
                    disabled={chevron.disabled}
                    disabledStyle={chevron.disabledStyle}
                    onPress={chevron.onPress}
                    iconStyle={chevron.iconStyle}
                    size={chevron.size}
                    color={chevron.color}
                    containerStyle={chevron.containerStyle}
                    raised={chevron.raised}
                />}
        </ListItem>
    );
};

export default memo(CommonFlatListItem);
