import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

export const MediaActions = (props) => {
    const {
        text,
        action,
        iconName,
        iconType,
        iconSize = 15,
        iconColor
    } = props;

    return (<View
        style={{
            position: 'relative',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 5
        }}
    >
        <Icon
            iconStyle={{ paddingTop: 10, paddingBottom: 10, paddingRight: 2 }}
            name={iconName}
            type={iconType}
            size={iconSize}
            color={iconColor}
            onPress={action}
        />
        <Text>{text}</Text>
    </View>);
};
