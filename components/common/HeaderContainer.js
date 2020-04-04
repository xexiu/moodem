import React, { Component } from 'react';
import { View } from 'react-native';

export class HeaderContainer extends Component {
    render() {
        const {
            containerViewTopHeader
        } = stylesTopHeader;

        return (
            <View style={containerViewTopHeader}>
                {this.props.children}
            </View>
        )
    }
}

const stylesTopHeader = {
    containerViewTopHeader: {
        position: 'relative',
        height: 40,
        marginTop: 35,
        flexDirection: 'row',
        alignItems: 'center'
    }
}