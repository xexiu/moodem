/* eslint-disable max-len */
import React, { memo } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Modal from 'react-native-modal';

const CustomModal = (props: any) => {
    const {
        isModalVisible,
        showRemoveIcon = true,
        onBackdropPress = console.log('Modal Pressed outside view'),
        action = onBackdropPress,
        onModalHide
    } = props;

    return (
        <Modal isVisible={isModalVisible} animationIn={'fadeInDownBig'} onBackdropPress={onBackdropPress} onModalHide={onModalHide}>
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
                {props.children}
            </View>
            <KeyboardSpacer />
        </Modal>
    );
};

memo(CustomModal);

export {
    CustomModal
};
