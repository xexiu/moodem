import React, { Component } from 'react';
import { View, Text } from 'react-native';

export class SongInfoTitle extends Component {
	public props: any;
	public songTitle: any;

    render() {
        const {
            songTitle
        } = this.props;

        return (
            <View style={{ minHeight: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{color: '#dd0031', fontSize: 22, textAlign: 'center' }} numberOfLines={1}>{songTitle}</Text>
            </View>
        )
    }
}