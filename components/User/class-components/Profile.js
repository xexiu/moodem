/* eslint-disable global-require */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';
import { WebView } from 'react-native-webview';

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
            // <WebView
            //         originWhitelist={['*']} <--- This must be set when using html prop
            //         source={{ html: '<iframe width="400" height="300" src="https://www.youtube.com/embed/cqyziA30whE" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>,<iframe width="400" height="300" src="http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>' }}
            //         style={{ marginTop: 120 }}
            // />
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>

                <Text>Profile2!</Text>
                <Text>Profile!</Text>
                <Text>Profile!</Text>
                <Text>Profile!</Text>
            </View>
        );
    }
}
