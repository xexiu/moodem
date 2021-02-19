import React, { Component } from 'react';
import { View } from 'react-native';

export class BodyContainer extends Component {
	public props: any;

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 10 }}>
                {this.props.children}
            </View>
        );
    }
}
