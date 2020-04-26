import React from 'react';
import { View, Text } from 'react-native';

const Disclaimer = () => (
    <View>
        <Text>Disclaimer</Text>
        <Text>Disclaimer</Text>
        <Text>Disclaimer</Text>
        <Text>Disclaimer</Text>
        <Text>Disclaimer</Text>
    </View>
);

Disclaimer.navigationOptions = ({ navigation, route }) => ({
    headerShown: false,
    headerMode: 'none',
    unmountOnBlur: true,
    drawerLabel: () => null,
    title: () => null,
});

export {
    Disclaimer
};
