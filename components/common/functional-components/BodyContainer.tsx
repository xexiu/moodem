import React, { Component } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[bodyContainer, customBodyContainerStyle]}>
                    {children}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
