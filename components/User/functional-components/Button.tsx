import React, { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

type propsButton = {
    containerStyle?: object,
    disabled?: boolean,
    text?: string | number,
    iconName?: string,
    iconType?: string,
    iconColor?: string,
    iconSize?: number,
    iconReverse?: boolean,
    iconStyle?: object,
    action?: any,
    disabledStyle?: object,
    textStyle?: object,
    iconColorDisabled?: string,
    iconRaised?: boolean
};

const Button = (props: propsButton) => {
    const {
        text,
        action,
        iconName,
        iconType,
        iconSize = 12,
        iconColor,
        iconColorDisabled = '#999',
        iconStyle = {},
        iconReverse = true,
        iconRaised = false,
        disabled,
        containerStyle,
        disabledStyle,
        textStyle = { marginRight: 4, marginLeft: 4, fontWeight: '600' }
    } = props;

    return (
        <TouchableOpacity
            onPress={action}
            disabled={disabled}
            style={{
                position: 'relative',
                flexDirection: 'row',
                alignItems: 'center'
            }}
        >
            <Icon
                disabledStyle={disabledStyle}
                iconStyle={iconStyle}
                reverse={iconReverse}
                raised={iconRaised}
                containerStyle={containerStyle}
                disabled={disabled}
                name={iconName}
                type={iconType}
                size={iconSize}
                color={disabled ? iconColorDisabled : iconColor}
                onPress={action}
            />
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
};

export default memo(Button);
