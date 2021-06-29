import React, { memo } from 'react';
import { Keyboard, SafeAreaView, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { bodyContainer } from '../../../src/css/styles/bodyContainer';

type bodyProps = {
    children: React.ReactNode,
    customBodyContainerStyle?: object,
    useScrollView?: boolean
};

export const BodyContainer = memo((props: bodyProps) => {
    const {
        children,
        customBodyContainerStyle,
        useScrollView = false
    } = props;

    function renderViewWithScroll() {
        if (useScrollView) {
            return (
                <ScrollView>
                    {children}
                </ScrollView>
            );
        }
        return (
            <View onStartShouldSetResponder={() => true} style={[bodyContainer, customBodyContainerStyle]}>
                {children}
            </View>
        );
    }

    return (
        <SafeAreaView
            style={[bodyContainer, customBodyContainerStyle]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                {renderViewWithScroll()}
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
});
