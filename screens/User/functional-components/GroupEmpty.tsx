import React from 'react';
import { View, Text } from 'react-native';

export const GroupEmpty = (props) => (
    <View style={{ alignItems: 'center', marginTop: 10, backgroundColor: 'transparent' }}>
        <Text>You dont have any group. Please create one!</Text>
    </View>
);
