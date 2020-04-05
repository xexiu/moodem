import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export class FallbackComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            error
        } = this.props;

        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text>Something happened!</Text>
                <Text>Error: {error.toString()}</Text>
                <TouchableOpacity onPress={this.props.reset}>
                    <Text>{'Try again'}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}