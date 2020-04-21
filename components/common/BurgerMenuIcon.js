import React from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export const BurgerMenuIcon = props => {
    const {
        action = () => console.log('Pressed Menu Icon')
    } = props;

    return (
        <Icon
            iconStyle={{ fontSize: 30 }}
            Component={TouchableScale}
            name='menu'
            type='simple-line-icons'
            raised
            color='#444'
            onPress={action}
        />
    );
};
