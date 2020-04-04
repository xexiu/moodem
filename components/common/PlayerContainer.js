import React, { Component } from 'react';
import { View } from 'react-native';

export class PlayerContainer extends Component {
    render() {
        return (
            <View style={[{ height: 200, borderBottomColor: '#eee', borderBottomWidth: 1, marginLeft: 10, marginRight: 10, position: 'relative' }, {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            }]}>
                {this.props.children}
            </View>
        )
    }
}