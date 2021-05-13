import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class MediaListEmpty extends Component {
    render() {
        return (
            <View style={{ alignItems: 'center', marginTop: 10, backgroundColor: 'transparent' }}>
                <Text>La lista de canciones está vacia!</Text>
            </View>
        );
    }
}
