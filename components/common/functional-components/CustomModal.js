/* eslint-disable max-len */
import React from 'react';
import Modal from 'react-native-modal';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

export const CustomModal = props => {
    const {
        isModalVisible,
        showRemoveIcon = true,
        onBackdropPress = console.log('Modal Pressed outside view'),
        action = onBackdropPress
    } = props;

    return (
        <Modal isVisible={isModalVisible} animationIn={'fadeInDownBig'} onBackdropPress={onBackdropPress}>
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, paddingBottom: 20 }}>
                <View style={{ alignItems: 'flex-end' }}>
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
