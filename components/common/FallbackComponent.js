import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

export class FallbackComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SafeAreaView>
                <View>
                    <Text>Something happened!</Text>
                    <Text>{props.error.toString()}</Text>
                    <TouchableOpacity onPress={props.resetError}>
                        <Text>{'Try again'}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}