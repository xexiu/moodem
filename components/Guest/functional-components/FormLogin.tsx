import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TextInput, TouchableHighlight, View } from 'react-native';
import * as yup from 'yup';
import ResetPassword from '../../../components/Guest/functional-components/ResetPassword';
import { loginText } from '../../../src/css/styles/login';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import { auth } from '../../../src/js/Utils/Helpers/services/firebase';
import CustomButton from '../../common/functional-components/CustomButton';
import CustomModal from '../../common/functional-components/CustomModal';
import PreLoader from '../../common/functional-components/PreLoader';

const controller = new AbortController();

const schema = yup.object().shape({
    email: yup.string().email(translate('register.inputEmailError')).required(translate('register.inputEmailError')),
    password: yup.string().min(6).required(translate('register.inputPasswordError'))
});

const commonInputStyles = {
    height: 30,
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    marginTop: 5,
    borderRadius: 3
};

const FormLogin = ({ modalRef, initMoodem }: any) => {
    const modalRefForgotPassword = useRef() as any;
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        register('email');
        register('password');

        return () => {
            controller.abort();
        };
    }, [register]);

    async function onSubmit(data: any) {
        if (data) {
            setIsLoading(true);
            try {
                await auth().signInWithEmailAndPassword(data.email, data.password);
                modalRef.setAllValues((prev: any) => ({ ...prev, isVisible: false }));
                setErrorText('');
                return initMoodem();
            } catch (error) {
                console.error('FormLogin Error', error);
                setIsLoading(false);
                if (error.code === 'auth/wrong-password') {
                    setErrorText(translate('login.wrongPassword'));
                } else if (error.code === 'auth/user-not-found') {
                    setErrorText(translate('login.userNotFound'));
                } else if (error.code === 'auth/too-many-requests') {
                    setErrorText(translate('login.tooManyRequests'));
                } else {
                    setErrorText(error.message);
                }
            }
        }
    }

    return (
        <View>
            <CustomModal
                ref={modalRefForgotPassword}
                onBackdropPress={() => {
                    return modalRefForgotPassword.current.setAllValues((prev: any) => ({ ...prev, isVisible: false }));
                }}
            />
            <Text style={loginText}>{translate('login.header')}</Text>
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>E-Mail</Text>
            <TextInput
                style={[errors.email && errors.email.message ?
                    [commonInputStyles, { borderColor: '#D84A05' }] :
                    [commonInputStyles]]}
                onChangeText={text => {
                    setValue('email', text);
                }}
                autoCorrect={false}
                autoCapitalize={'none'}
                placeholder={translate('register.placeholderInputEmail')}
                autoFocus
            />
            <Text
                style={{
                    color: '#D84A05',
                    marginTop: 5,
                    marginBottom: 5
                }}
            >
                {errors.email && errors.email.message}
            </Text>
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>{translate('register.inputPassword')}</Text>
            <TextInput
                style={[errors.password && errors.password.message ?
                    [commonInputStyles, { borderColor: '#D84A05' }] :
                    [commonInputStyles]]}
                onChangeText={text => {
                    setValue('password', text);
                }}
                autoCorrect={false}
                secureTextEntry
                placeholder={translate('register.placeholderInputPassword')}
            />
            <Text
                style={{
                    color: '#D84A05',
                    marginTop: 5,
                    marginBottom: 5
                }}
            >
                {errors.password && errors.password.message}
            </Text>
            {!!errorText &&
                <View>
                    <Text style={{ textAlign: 'center', margin: 10, color: '#222' }}>{errorText}</Text>
                    <TouchableHighlight
                        underlayColor={'#f0f0f0'}
                        onPress={async () => {
                            return modalRefForgotPassword.current.setAllValues((prev: any) => {
                                return {
                                    ...prev,
                                    isVisible: true,
                                    element: () => {
                                        return (<ResetPassword />);
                                    }
                                };
                            });
                        }}
                    >
                        <Text style={{ textAlign: 'center', margin: 10, color: '#dd0031' }}>{translate('forgotPassword.title')}</Text>
                    </TouchableHighlight>
                </View>
            }

            {isLoading ?
                <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                <CustomButton
                    btnDisabled={isLoading}
                    btnTitle={translate('login.title')}
                    action={handleSubmit(onSubmit)}
                />
            }
        </View>
    );
};

export default memo(FormLogin);
