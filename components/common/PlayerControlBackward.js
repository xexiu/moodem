import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export class PlayerControlBackward extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            onPressBackward
        } = this.props;

        return (
            <Icon
                Component={TouchableScale}
                raised
                name='step-backward'
                type='font-awesome'
                color='#777'
                size={18}
                onPress={() => {
                    onPressBackward();
                }}
            />
        );
    }
}
