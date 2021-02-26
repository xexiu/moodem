/* eslint-disable max-len */
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
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

export function VerifyEmailMsg(props: any) {
    const [disabledBtn, setdisabledBtn] = useState(false);

    const {
        user
    } = props;

    if (!user.emailVerified) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 30 }}>
                <Icon
                    iconStyle={{ marginRight: 5 }}
                    name='warning'
                    type='ant-design'
                    color='#dd0031'
                    size={24}
                />
                <Text>E-mail no verificado.</Text>
                <CustomButton
                    btnDisabled={disabledBtn}
                    shadow={{}}
                    btnStyle={{ backgroundColor: 'transparent' }}
                    btnTitleStyle={{ color: '#00b7e0', fontSize: 14, paddingTop: 0 }}
                    btnTitle='Verificar ahora!'
                    action={() => {
                        setdisabledBtn(true);
                        user.sendEmailVerification()
                            .then(() => handleVerifyMsg())
                            .catch((err: any) => handleVerifyMsg(err));
                    }}
                />
            </View>
        );
    }
}
