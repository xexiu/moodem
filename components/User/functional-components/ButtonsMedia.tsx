import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';

const formatCash = (n: number) => {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
};

const ButtonsMedia = (props: any) => {
    const {
        text,
        action,
        iconName,
        iconType,
        iconSize = 15,
        iconColor,
        disabled,
        containerStyle
    } = props;

    return (
        <TouchableOpacity onPress={action}>
            <View
                style={{
                    position: 'relative',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    width: 50,
                    height: 30
                }}
            >
                <Icon
                    containerStyle={containerStyle}
                    disabled={disabled}
                    name={iconName}
                    type={iconType}
                    size={iconSize}
                    color={disabled ? '#999' : iconColor}
                    onPress={action}
                />
                <Text>{formatCash(text)}</Text>
            </View>
        </TouchableOpacity>
    );
};

ButtonsMedia.propTypes = {
    containerStyle: PropTypes.object
};

memo(ButtonsMedia);

export { ButtonsMedia };
