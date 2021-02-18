/* eslint-disable max-len */
import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

export const BurgerMenuIcon = memo(props => {
    const {
        action = () => console.log('Pressed Menu Icon'),
        customStyle
    } = props;

    return (
        <View style={[{ position: 'absolute', zIndex: 1000 }, customStyle]}>
            <Icon
                iconStyle={{ fontSize: 30 }}
                Component={TouchableScale}
                name='menu'
                type='simple-line-icons'
                raised
                size={20}
                color='#444'
                onPress={action}
            />
        </View>
    );
});
