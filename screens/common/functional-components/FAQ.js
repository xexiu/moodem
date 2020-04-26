import React from 'react';
import { View, Text } from 'react-native';

const FAQ = () => (
    <View>
        <Text>FAQ</Text>
        <Text>FAQ</Text>
        <Text>FAQ</Text>
        <Text>FAQ</Text>
        <Text>FAQ</Text>
    </View>
);

FAQ.navigationOptions = ({ navigation, route }) => ({
    headerShown: false,
    headerMode: 'none',
    unmountOnBlur: true,
    drawerLabel: () => null,
    title: () => null,
});

export {
    FAQ
};

