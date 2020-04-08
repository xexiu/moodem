import React, { Component } from 'react';
import { View } from 'react-native';

export class SongInfoContainer extends Component {
    render() {
        return (
            <View style={{ height: 60 }}>
                {this.props.children}
            </View>
        )
    }
}