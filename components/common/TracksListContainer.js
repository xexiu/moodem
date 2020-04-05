import React, { Component } from 'react';
import { View } from 'react-native';

export class TracksListContainer extends Component {
    render() {
        return (
            <View style={[{ flex: 1, marginTop: 5, marginLeft: 10, marginRight: 10, position: 'relative' }]}>
                {this.props.children}
            </View>
        )
    }
}