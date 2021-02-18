/* eslint-disable max-len */
import React, { memo, useMemo } from 'react';
import FastImage from 'react-native-fast-image';
import { View, Text, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';

export const CommonFlatListItem = memo((props) => {
    const {
        disabled,
        disabledStyle,
        withBadgeIcon,
        bottomDivider = true,
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
        leftElement,
        rightElement,
        buttonGroup,
        chevron,
        checkmark,
        checkBox,
        action,
        component = TouchableOpacity,
        pad
    } = props;

    const myAvatar = useMemo(() => (<FastImage
        style={{ width: 30, height: 30, borderRadius: 10, borderColor: '#ddd', borderWidth: 1 }}
        title={leftAvatar.title}
        source={{
            uri: leftAvatar.source.uri,
            priority: FastImage.priority.high
        }}
    />));

    return (
        <View style={{ position: 'relative' }}>
            <ListItem topDivider>
                {myAvatar}
                <ListItem.Content>
                    <ListItem.Title style={titleStyle}>{title}</ListItem.Title>
                    <ListItem.Subtitle style={subtitleStyle}>{subtitle}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </View>
    );
});
