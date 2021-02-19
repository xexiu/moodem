/* eslint-disable max-len */
import React, { Component } from 'react';
import { View } from 'react-native';

export class MainContainer extends Component {
	public props: any;

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 30, position: 'relative' }}>
                {this.props.children}
            </View>
        );
    }
}
