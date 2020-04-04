import React, { Component } from 'react';
import { View, Text } from 'react-native';

export class SongInfoALbum extends Component {
    render() {
        const {
            songAlbum
        } = this.props;

        return (
            <View style={{ height: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <Text style={{color: '#777' }} numberOfLines={1}>{songAlbum}</Text>
            </View>
        )
    }
}