import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const formatCash = (n: number) => {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
};

const Button = (props: any) => {
    const {
        text,
        action,
        iconName,
        iconType,
        iconSize = 12,
        iconColor,
        iconStyle = {},
        iconReverse = true,
        disabled,
        containerStyle
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
                iconStyle={iconStyle}
                reverse={iconReverse}
                containerStyle={containerStyle}
                disabled={disabled}
                name={iconName}
                type={iconType}
                size={iconSize}
                color={disabled ? '#999' : iconColor}
                onPress={action}
            />
            <Text style={{ marginRight: 4, marginLeft: 4, fontWeight: '600' }}>{formatCash(text)}</Text>
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
    action: PropTypes.func
};

export default memo(Button);
