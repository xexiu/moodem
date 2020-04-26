/* eslint-disable global-require */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';

export class Profile extends Component {
    static navigationOptions = ({ navigation, route }) => ({
        headerMode: 'none',
        headerShown: false,
        title: getGroupName(route.params.groupName, 'Profile')
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
