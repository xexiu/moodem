import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export class PlayerControlForward extends Component {
	public props: any;
	public onPressForward: any;

    constructor(props) {
        super(props);
    }

    render() {
        const {
            onPressForward
        } = this.props;

        return (
            <Icon
                Component={TouchableScale}
                raised
                name='step-forward'
                type='font-awesome'
                color='#777'
                size={18}
                onPress={() => {
                    onPressForward();
                }} />
        )
    }
}