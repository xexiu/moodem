/* eslint-disable max-len */
import React, { useContext, useRef } from 'react';
import { ScrollView } from 'react-native';
import Toast from 'react-native-easy-toast';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PushNotification from 'react-native-push-notification';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import { logOut } from '../../../src/js/Utils/Helpers/actions/users';
import BurgerMenuIcon from '../../common/functional-components/BurgerMenuIcon';
import CustomButton from '../../common/functional-components/CustomButton';
import { AppContext } from '../store-context/AppContext';
import FormNickName from './FormNickName';
import FormUserEmail from './FormUserEmail';
import FormUserPassword from './FormUserPassword';
import ProfileAvatar from './ProfileAvatar';
import VerifyEmailMsg from './VerifyEmailMsg';

const Profile = (props: any) => {
    const { navigation } = props;
    const { dispatchContextApp } = useContext(AppContext) as any;
    const toastRef = useRef() as any;

    async function handleLogOut() {
        await logOut();
        PushNotification.abandonPermissions();
        await dispatchContextApp({
            type: 'guest',
            value: {
                user: null,
                isLoading: false,
                isServerError: false,
                socket: null
            }
        });
        return navigation.navigate('Drawer', {
            screen: 'Guest'
        });
    }

    return (
        <BodyContainer>
            <Toast
                position='top'
                ref={toastRef}
            />
            <BurgerMenuIcon action={() => navigation.openDrawer()} />
            <VerifyEmailMsg />
            <ScrollView>
                <ProfileAvatar />
                <FormNickName />
                <FormUserEmail />
                <FormUserPassword />
            </ScrollView>
            <KeyboardSpacer />
            <CustomButton
                btnTitle={translate('profile.session.close')}
                btnStyle={{ backgroundColor: 'transparent', marginTop: 10 }}
                btnRaised={false}
                shadow={{}}
                btnTitleStyle={{ color: '#dd0031', fontSize: 16 }}
                action={handleLogOut}
            />
        </BodyContainer>
    );
};

export {
    Profile
};
