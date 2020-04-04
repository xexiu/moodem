import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export class PlayerControlShuffle extends Component {
    render() {
        return (
            <Icon
                iconStyle={{ marginTop: 20, marginRight: 20 }}
                Component={TouchableScale}
                name='random'
                type='font-awesome'
                color='#777'
                onPress={() => console.log('Pressed Shuffle Control Player')} />
        )
    }
}