import React, { Component } from 'react';
import { View } from 'react-native';

export class PlayerContainer extends Component {
    render() {
        return (
            <View style={[{ marginLeft: 10, marginRight: 10, position: 'relative' }]}>
                {this.props.children}
            </View>
        )
    }
}