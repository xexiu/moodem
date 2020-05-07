import React, { Component } from 'react';
import { View } from 'react-native';

export class MainContainer extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 30 }}>
                {this.props.children}
            </View>
        );
    }
}
