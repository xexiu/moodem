import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export class PlayerControlRepeat extends Component {
    render() {
        return (
            <Icon iconStyle={{ marginTop: 20, marginLeft: 20 }}
                Component={TouchableScale}
                name='repeat'
                type='font-awesome'
                color='#777'
                size={24}
                onPress={() => console.log('Pressed Forward Control Player')} />
        )
    }
}