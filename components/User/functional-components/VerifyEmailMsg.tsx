/* eslint-disable max-len */
import React, { memo, useContext } from 'react';
import { Alert, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import CustomButton from '../../../components/common/functional-components/CustomButton';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import { AppContext } from '../store-context/AppContext';

const handleVerifyMsg = () => Alert.alert(
    'Please check your email for the confirmation link.',
    null,
    [
        { text: 'OK', onPress: () => console.log('Pressed OK') }
    ],
    { cancelable: false }
);

const VerifyEmailMsg = () => {
    const { user } = useContext(AppContext) as any;

    if (user.emailVerified) {
        return null;
    }
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 30 }}>
            <Icon
                iconStyle={{ marginRight: 5 }}
                name='warning'
                type='ant-design'
                color='#dd0031'
                size={24}
            />
            <Text>{translate('profile.notVerifiedEmail.text.0')}</Text>
            <CustomButton
                shadow={{}}
                btnStyle={{ backgroundColor: 'transparent' }}
                btnTitleStyle={{ color: '#00b7e0', fontSize: 14, paddingTop: 0 }}
                btnTitle={translate('profile.notVerifiedEmail.text.1')}
                action={() => {
                    user.sendEmailVerification()
                        .then(() => handleVerifyMsg())
                        .catch((err: any) => handleVerifyMsg());
                }}
            />
        </View>
    );
};

export default memo(VerifyEmailMsg);
