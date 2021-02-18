import React from 'react';
import { View, Text } from 'react-native';

export const MediaListEmpty = () => (
    <View style={{ alignItems: 'center', marginTop: 10, backgroundColor: 'transparent' }}>
        <Text>List of media is empty. Try and search for one!</Text>
    </View>
);
