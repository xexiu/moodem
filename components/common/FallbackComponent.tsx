import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export class FallbackComponent extends Component {
    public props: any;
    public error: any;

    constructor(props) {
        super(props);
    }

    render() {
        const {
            error,
        } = this.props;

        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text>Something happened!</Text>
                <Text>Error: {error.toString()}</Text>
                <TouchableOpacity onPress={this.props.reset}>
                    <Text>{'Try again'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
