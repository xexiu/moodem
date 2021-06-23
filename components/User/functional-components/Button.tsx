import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const Button = (props: any) => {
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

Button.propTypes = {
    containerStyle: PropTypes.object,
    disabled: PropTypes.bool,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    iconName: PropTypes.string.isRequired,
    iconType: PropTypes.string,
    iconColor: PropTypes.string,
    iconSize: PropTypes.number,
    iconReverse: PropTypes.bool,
    iconStyle: PropTypes.object,
    action: PropTypes.func,
    disabledStyle: PropTypes.object,
    textStyle: PropTypes.object,
    iconColorDisabled: PropTypes.string,
    iconRaised: PropTypes.bool
};

export default memo(Button);
