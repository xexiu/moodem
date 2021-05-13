import React, { Component } from 'react';
import { View } from 'react-native';
import { bodyContainer } from '../../../src/css/styles/bodyContainer';

type bodyProps = {
    children: React.ReactNode,
    customBodyContainerStyle?: object
};
export default class BodyContainer extends Component<bodyProps> {
    render() {
        const {
            children,
            customBodyContainerStyle
        } = this.props;

        return (
            <View style={[bodyContainer, customBodyContainerStyle]}>
                {children}
            </View>
        );
    }
}
