import React, { Component } from 'react';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View } from 'react-native';
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
            <SafeAreaView style={[bodyContainer, customBodyContainerStyle]}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[bodyContainer, customBodyContainerStyle]}>
                        {children}
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        );
    }
}
