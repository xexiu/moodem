import React from 'react';
import { View, Text } from 'react-native';

const About = () => (
    <View>
        <Text>About</Text>
        <Text>About</Text>
        <Text>About</Text>
        <Text>About</Text>
        <Text>About</Text>
    </View>
);

About.navigationOptions = ({ navigation, route }) => ({
    headerShown: false,
    headerMode: 'none',
    unmountOnBlur: true,
    drawerLabel: () => null,
    title: () => null,
});

export {
    About
};

