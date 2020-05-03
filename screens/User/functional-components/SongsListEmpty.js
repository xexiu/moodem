import React from 'react';
import { View, Text } from 'react-native';

export const SongsListEmpty = (props) => (
    <View style={{ alignItems: 'center', marginTop: 10, backgroundColor: 'transparent' }}>
        <Text>List of songs is empty. Try and search for one!</Text>
    </View>
);
