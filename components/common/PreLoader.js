import React, { Component } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
/* eslint-disable class-methods-use-this */

export class PreLoader extends Component {
    render() {
        const {
            size = 30
        } = this.props
        return (
            <View style={{ marginTop: 4, paddingLeft: 5, paddingRight: 5 }}>
                <Progress.Circle size={size} indeterminate={true} color={'#dd0031'} />
            </View>
        );
    }
}