import React, { memo, useContext, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import { Icon } from 'react-native-elements';
import { commonFormContainer} from '../../../src/css/styles/form';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import CustomButton from '../../common/functional-components/CustomButton';
import { AppContext } from '../store-context/AppContext';

const FormUserPassword = () => {
    const { user } = useContext(AppContext) as any;
    const [allValues, setAllValues] = useState({
        userPassword: '',
        isLoading: false
    });
    const toastRef = useRef() as any;

    function resetValues() {
        return setAllValues((prev: any) => {
            return {
                ...prev,
                isLoading: false,
                userPassword: ''
            };
        });
    }

    async function handleUserPasswordChange() {
        setAllValues((prev: any) => {
            return {
                ...prev,
                isLoading: true
            };
        });

        try {
            await user.updatePassword(allValues.userPassword);
            resetValues();
            toastRef.current.show(`${translate('profile.formTexts.info.0')}`, 2000);
        } catch (error) {
            console.warn('handleUserPasswordChange Error', error);
            resetValues();
            toastRef.current.show(error.message, 2000);
        }
    }

    return (
        <View style={{ position: 'relative', flexDirection: 'row', marginBottom: 10 }}>
            <Toast
                position='top'
                ref={toastRef}
            />
            <TextInput
                style={commonFormContainer}
                underlineColorAndroid='transparent'
                placeholder={translate('profile.formTexts.changePassword')}
                placeholderTextColor='#777'
                autoCapitalize='none'
                secureTextEntry
                autoCorrect={false}
                clearTextOnFocus
                editable={!allValues.isLoading}
                value={allValues.userPassword}
                onChangeText={(text: string) => {
                    setAllValues((prev: any) => {
                        return {
                            ...prev,
                            isLoading: false,
                            userPassword: text
                        };
                    });
                }}
            />
            <CustomButton
                btnDisabled={allValues.isLoading}
                btnTitle=''
                btnIcon={
                    (
                        <Icon
                            iconStyle={{ backgroundColor: 'transparent' }}
                            name='check'
                            type='entypo'
                            color='white'
                            size={22}
                        />
                    )
                }
                btnStyle={{ width: 50, height: 30, padding: 0, marginLeft: 10 }}
                btnTitleStyle={{ fontSize: 15 }}
                action={handleUserPasswordChange}
            />
        </View>
    );
};

export default memo(FormUserPassword);
