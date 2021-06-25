import React, { memo, useContext, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import { Icon } from 'react-native-elements';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import CustomButton from '../../common/functional-components/CustomButton';
import { AppContext } from '../store-context/AppContext';

const FormNickName = () => {
    const { user, dispatchContextApp } = useContext(AppContext) as any;
    const [allValues, setAllValues] = useState({
        userNickName: '',
        isLoading: false
    });
    const toastRef = useRef() as any;

    function resetValues() {
        return setAllValues((prev: any) => {
            return {
                ...prev,
                isLoading: false,
                userNickName: ''
            };
        });
    }

    async function handleUserNameChange() {
        setAllValues((prev: any) => {
            return {
                ...prev,
                isLoading: true
            };
        });

        if (allValues.userNickName.length <= 4) {
            setAllValues((prev: any) => {
                return {
                    ...prev,
                    isLoading: false
                };
            });
            return toastRef.current.show(`${translate('profile.formTexts.errors.0')}`, 3000);
        }

        try {
            await user.updateProfile({
                displayName: allValues.userNickName
            });
            await dispatchContextApp({
                type: 'set_user',
                value: {
                    user
                }
            });
            resetValues();
            toastRef.current.show(`${translate('profile.formTexts.info.0')}`, 2000);
        } catch (error) {
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
                style={{
                    borderWidth: 1,
                    fontStyle: 'italic',
                    padding: 5,
                    borderColor: '#eee',
                    borderRadius: 5,
                    width: '80%'
                }}
                underlineColorAndroid='transparent'
                placeholder={translate('profile.formTexts.changeNickName')}
                placeholderTextColor='#777'
                autoCapitalize='none'
                autoCorrect={false}
                clearTextOnFocus
                editable={!allValues.isLoading}
                value={allValues.userNickName}
                onChangeText={(text: string) => {
                    setAllValues((prev: any) => {
                        return {
                            ...prev,
                            isLoading: false,
                            userNickName: text
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
                            name={allValues.isLoading ? 'circle' : 'check'}
                            type='entypo'
                            color='white'
                            size={22}
                        />
                    )
                }
                btnStyle={{ width: 50, height: 30, padding: 0, marginLeft: 10 }}
                btnTitleStyle={{ fontSize: 15 }}
                action={handleUserNameChange}
            />
        </View>
    );
};

export default memo(FormNickName);
