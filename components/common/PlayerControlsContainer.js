import React, { Component } from 'react';
import { View } from 'react-native';

export class PlayerControlsContainer extends Component {
    render() {
        return (
            <View style={{ height: 120, justifyContent: 'center', flexDirection: 'row' }}>
                {this.props.children}
            </View>
        )
    }
}