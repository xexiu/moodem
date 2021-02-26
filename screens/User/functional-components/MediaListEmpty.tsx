import React from 'react';
import { Text, View } from 'react-native';

export const MediaListEmpty = () => (
    <View style={{ alignItems: 'center', marginTop: 10, backgroundColor: 'transparent' }}>
        <Text>La lista de canciones está vacia!</Text>
    </View>
);
