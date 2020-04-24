/* eslint-disable global-require */
import React, { Component } from 'react';
import { View, Text } from 'react-native';

export class Profile extends Component {
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
                <Text>Profile!</Text>
                <Text>Profile!</Text>
                <Text>Profile!</Text>
                <Text>Profile!</Text>
            </View>
        );
    }
}
