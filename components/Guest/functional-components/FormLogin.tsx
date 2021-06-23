import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TextInput, TouchableHighlight, View } from 'react-native';
import * as yup from 'yup';
import ResetPassword from '../../../components/Guest/functional-components/ResetPassword';
import { loginText } from '../../../src/css/styles/login';
import { FORM_FIELDS_LOGIN } from '../../../src/js/Utils/constants/form';
import { loginHandler } from '../../../src/js/Utils/Helpers/actions/users';
import CustomButton from '../../common/functional-components/CustomButton';
import CustomModal from '../../common/functional-components/CustomModal';
import PreLoader from '../../common/functional-components/PreLoader';

const controller = new AbortController();

const schema = yup.object().shape({
    email: yup.string().email(FORM_FIELDS_LOGIN.email.error).required(FORM_FIELDS_LOGIN.email.error),
    password: yup.string().min(6).required(FORM_FIELDS_LOGIN.password.error)
});

const commonInputStyles = {
    height: 30,
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    marginTop: 5,
    borderRadius: 3
};

const FormLogin = (props: any) => {
    const { modalRef } = props;
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

    async function onSubmit(dataInput: object) {
        if (dataInput) {
            setIsLoading(true);
            try {
                await loginHandler(dataInput);
                setIsLoading(false);
                modalRef.setAllValues((prev: any) => ({ ...prev, isVisible: false }));
                setErrorText('');
            } catch (error) {
                console.error('FormLogin Error', JSON.stringify(error));
                setIsLoading(false);
                if (error.code === 'auth/wrong-password' || error.code === 'auth/too-many-requests') {
                    setErrorText(error.message);
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
            <Text style={loginText}>Tú tienes las llaves!</Text>
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
                placeholder={FORM_FIELDS_LOGIN.email.help}
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
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>Contraseña</Text>
            <TextInput
                style={[errors.password && errors.password.message ?
                    [commonInputStyles, { borderColor: '#D84A05' }] :
                    [commonInputStyles]]}
                onChangeText={text => {
                    setValue('password', text);
                }}
                autoCorrect={false}
                secureTextEntry
                placeholder={FORM_FIELDS_LOGIN.password.help}
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
                        <Text style={{ textAlign: 'center', margin: 10, color: '#dd0031' }}>Forgot password?</Text>
                    </TouchableHighlight>
                </View>
            }

            {isLoading ?
                <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                <CustomButton
                    btnTitle='Iniciar Sesión'
                    action={handleSubmit(onSubmit)}
                />
            }
        </View>
    );
};

export default memo(FormLogin);
