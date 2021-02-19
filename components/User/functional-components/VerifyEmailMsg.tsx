/* eslint-disable max-len */
import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { CustomButton } from '../../../components/common/functional-components/CustomButton';

const handleVerifyMsg = () => Alert.alert(
    'Please check your email for the confirmation link.',
    null,
    [
        { text: 'OK', onPress: () => console.log('Pressed OK') }
    ],
    { cancelable: false }
);

export function VerifyEmailMsg(props) {
    const [disabledBtn, setdisabledBtn] = useState(false);

    const {
        user
    } = props;

    if (!user.emailVerified) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 50 }}><Icon
                iconStyle={{ marginRight: 5 }}
                name='warning'
                type='ant-design'
                color='#dd0031'
                size={24}
            />
                <Text>E-mail not verified.</Text>
                <CustomButton
                    btnDisabled={disabledBtn}
                    shadow={{}}
                    btnStyle={{ backgroundColor: 'transparent' }}
                    btnTitleStyle={{ color: '#00b7e0', fontSize: 14, paddingTop: 0 }}
                    btnTitle="Please verify now!"
                    action={() => {
                        setdisabledBtn(true);
                        user.sendEmailVerification()
                        .then(() => handleVerifyMsg())
                        .catch(err => handleVerifyMsg(err));
                    }}
                />
            </View>
        );
    }
}
