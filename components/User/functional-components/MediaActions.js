import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

export const MediaActions = memo((props) => {
    const {
        text,
        action,
        iconName,
        iconType,
        iconSize = 15,
        iconColor,
        disabled
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
            disabled={disabled}
            iconStyle={[{
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 2
            }, disabled && { backgroundColor: '#fff' }]}
            name={iconName}
            type={iconType}
            size={iconSize}
            color={disabled ? '#999' : iconColor}
            onPress={action}
        />
        <Text style={disabled && { color: '#999' }}>{text}</Text>
    </View>);
});
