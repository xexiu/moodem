/* eslint-disable max-len */
import React, { memo } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
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
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, paddingBottom: 20 }}>
                <View style={{ alignSelf: 'flex-end' }}>
                    {showRemoveIcon && <Icon
                        containerStyle={{ width: 25 }}
                        name={'remove'}
                        type={'font-awesome'}
                        size={25}
                        color='#ddd'
                        onPress={action}
                    />}
                </View>
                {props.children}
            </View>
        </Modal>
    );
};

memo(CustomModal);

export {
    CustomModal
};
