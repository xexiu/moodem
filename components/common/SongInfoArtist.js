import React, { Component } from 'react';
import { View, Text } from 'react-native';

export class SongInfoArtist extends Component {
    render() {
        const {
            songArtist
        } = this.props;

        return (
            <View style={{ height: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{color: '#777' }} numberOfLines={1}>{songArtist}</Text>
            </View>
        )
    }
}