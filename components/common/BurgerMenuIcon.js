/* eslint-disable max-len */
import React from 'react';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

export const BurgerMenuIcon = props => {
    const {
        action = () => console.log('Pressed Menu Icon')
    } = props;

    return (
        <View style={{ position: 'absolute', top: -12, left: 0, width: 70, height: 70, zIndex: 1000 }}>
            <Icon
            iconStyle={{ fontSize: 30 }}
            Component={TouchableScale}
            name='menu'
            type='simple-line-icons'
            raised
            color='#444'
            onPress={action}
            />
        </View>
    );
};
