/* eslint-disable max-len */
import React, { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Modal from 'react-native-modal';

const CustomModal = forwardRef((props: any, ref: any) => {
    const {
        showRemoveIcon = true,
        onBackdropPress = () => {},
        action = onBackdropPress,
        onModalHide
    } = props;

    const [allValues, setAllValues] = useState({
        isVisible: false,
        element: null
    });

    useImperativeHandle(ref, () => {
        return {
            isVisible: allValues.isVisible,
            element: allValues.element,
            setAllValues
        };
    }, [allValues.isVisible, allValues.element]);

    return (
        <Modal
            isVisible={allValues.isVisible}
            animationIn={'fadeInDownBig'}
            onBackdropPress={onBackdropPress}
            onModalHide={onModalHide}
        >
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, paddingBottom: 20, position: 'relative' }}>
                <View style={{ alignSelf: 'flex-end', position: 'absolute', top: -5, right: -5, padding: 5, zIndex: 100 }}>
                    {showRemoveIcon && <Icon
                        reverse
                        name={'remove'}
                        type={'font-awesome'}
                        size={15}
                        color='#ddd'
                        onPress={action}
                    />}
                </View>
                {allValues.element && allValues.element()}
                {props.children}
            </View>
            <KeyboardSpacer />
        </Modal>
    );
});

export default memo(CustomModal);
