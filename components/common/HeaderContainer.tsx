import React, { Component } from 'react';
import { View } from 'react-native';

export class HeaderContainer extends Component {
    public props: any;
    public containerViewTopHeader: any;

    render() {
        const {
            containerViewTopHeader,
        } = stylesTopHeader;

        return (
            <View style={containerViewTopHeader}>
                {this.props.children}
            </View>
        );
    }
}

const stylesTopHeader = {
    containerViewTopHeader: {
        position: 'relative',
        height: 150,
        marginTop: 35,
        flexDirection: 'row',
        alignItems: 'center',
    },
};
