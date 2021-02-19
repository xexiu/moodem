import React, { Component } from 'react';
import { View, Text } from 'react-native';

export class SongInfoTime extends Component {
	public props: any;
	public songTime: any;

    render() {
        const {
            songTime
        } = this.props;

        return (
            <View style={{ minHeight: 30, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, bottom: -100 }}>
                <Text style={{color: '#dd0031', fontSize: 12, textAlign: 'center' }} numberOfLines={1}>{songTime}</Text>
            </View>
        )
    }
}