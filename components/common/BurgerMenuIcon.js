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
        <View style={{ position: 'absolute', top: 20, left: 0, width: 30, height: 30, zIndex: 1000 }}>
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
};
