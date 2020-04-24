/* eslint-disable global-require */
import React, { Component } from 'react';
import { View, Text } from 'react-native';

export class Settings extends Component {
    static navigationOptions = ({ navigation, route }) => ({
        headerMode: 'none',
        headerShown: false
    });

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text>Settings!</Text>
                <Text>Settings!</Text>
                <Text>Settings!</Text>
                <Text>Settings!</Text>
            </View>
        );
    }
}
