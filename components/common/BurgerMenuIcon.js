import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export class BurgerMenuIcon extends Component {
    render() {
        return (
            <Icon
                    iconStyle={ { fontSize: 30 }}
                    Component={TouchableScale}
                    name='menu'
                    type='simple-line-icons'
                    raised
                    color='#444'
                    onPress={() => console.log('Pressed Menu Icon')} />
        )
    }
}