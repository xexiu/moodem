/* eslint-disable max-len */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';

export const CommonFlatListItem = (props) => {
    const {
        disabled,
        disabledStyle,
        withBadgeIcon,
        bottomDivider,
        topDivider,
        containerStyle,
        contentContainerStyle,
        rightContentContainerStyle,
        title,
        titleStyle,
        titleProps,
        subtitle,
        subtitleStyle,
        subtitleProps,
        rightTitle,
        rightTitleStyle,
        rightTitleProps,
        rightSubtitle,
        rightSubtitleStyle,
        rightSubtitleProps,
        leftIcon,
        rightIcon,
        leftAvatar,
        rightAvatar,
        buttonGroup,
        chevron,
        checkmark,
        checkBox,
        action,
        component = TouchableOpacity,
        pad
    } = props;

    return (
        <View style={{ position: 'relative' }}>
            <ListItem
                disabled={disabled}
                disabledStyle={disabledStyle}
                badge={withBadgeIcon}
                bottomDivider={bottomDivider}
                topDivider={topDivider}
                Component={component}
                containerStyle={containerStyle}
                contentContainerStyle={contentContainerStyle}
                rightContentContainerStyle={rightContentContainerStyle}
                title={title}
                titleStyle={titleStyle}
                titleProps={titleProps}
                subtitle={subtitle}
                subtitleStyle={subtitleStyle}
                subtitleProps={subtitleProps}
                rightTitle={rightTitle}
                rightTitleStyle={rightTitleStyle}
                rightTitleProps={rightTitleProps}
                rightSubtitle={rightSubtitle}
                rightSubtitleStyle={rightSubtitleStyle}
                rightSubtitleProps={rightSubtitleProps}
                rightIcon={rightIcon}
                leftIcon={leftIcon}
                leftAvatar={leftAvatar}
                rightAvatar={rightAvatar}
                buttonGroup={buttonGroup}
                chevron={chevron}
                checkmark={checkmark}
                checkBox={checkBox}
                onPress={action}
                pad={pad}
            />
        </View>
    );
};
