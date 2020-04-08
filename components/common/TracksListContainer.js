import React, { Component } from 'react';
import { View } from 'react-native';

export class TracksListContainer extends Component {
    render() {
        return (
            <View style={[{ flex: 1, marginTop: 15, marginLeft: 12, marginRight: 12, position: 'relative' }]}>
                {this.props.children}
            </View>
        )
    }
}