/* eslint-disable global-require */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';

export class Settings extends Component {
    static navigationOptions = ({ navigation, route }) => ({
        headerMode: 'none',
        headerShown: false,
        title: getGroupName(route.params.groupName, 'Settings')
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
