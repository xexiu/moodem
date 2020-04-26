import React from 'react';
import { View, Text } from 'react-native';

const Copyright = () => (
    <View>
        <Text>Copyright</Text>
        <Text>Copyright</Text>
        <Text>Copyright</Text>
        <Text>Copyright</Text>
        <Text>Copyright</Text>
    </View>
);

Copyright.navigationOptions = ({ navigation, route }) => ({
    headerShown: false,
    headerMode: 'none',
    unmountOnBlur: true,
    drawerLabel: () => null,
    title: () => null,
});

export {
    Copyright
};
