import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import * as yup from 'yup';
import { loginText } from '../../../src/css/styles/login';
import { FORM_FIELDS_LOGIN } from '../../../src/js/Utils/constants/form';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import { auth } from '../../../src/js/Utils/Helpers/services/firebase';
import CustomButton from '../../common/functional-components/CustomButton';
import PreLoader from '../../common/functional-components/PreLoader';

const commonInputStyles = {
    height: 30,
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    marginTop: 5,
    borderRadius: 3
};

const schema = yup.object().shape({
    email: yup.string().email(translate('register.inputEmailError')).required(translate('register.inputEmailError'))
});

const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        register('email');
    }, [register]);

    async function onSubmit(data: any) {
        if (data) {
            setIsLoading(true);
            try {
                await auth().sendPasswordResetEmail(data.email);
                setErrorText('Email enviado correctamente!');
                setIsLoading(false);
            } catch (error) {
                console.warn('ResetPassword Error', error);
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
        <View style={{ alignItems: 'center', padding: 5 }}>
            <Text style={loginText}>Give me my keys back!</Text>
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>E-Mail</Text>
            <TextInput
                style={[errors.email && errors.email.message ?
                    [commonInputStyles, { borderColor: '#D84A05' }] : [commonInputStyles]]}
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

            {isLoading ?
                <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                <CustomButton
                    btnTitle={translate('forgotPassword.resetPassword')}
                    action={handleSubmit(onSubmit)}
                />
            }
            {
                !!errorText &&
                <View>
                    <Text style={{ textAlign: 'center', margin: 10, color: '#222' }}>{errorText}</Text>
                </View>
            }
        </View>
    );
};

export default memo(ResetPassword);
