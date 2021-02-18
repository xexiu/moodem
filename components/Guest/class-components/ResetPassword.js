/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
import React, { useState, useEffect, memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { CustomModal } from '../../common/functional-components/CustomModal';
import { resetPasswordHandler } from '../../../src/js/Utils/Helpers/actions/resetPasswordHandler';
import { loginText } from '../../../src/css/styles/login';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { FORM_FIELDS_LOGIN } from '../../../src/js/Utils/constants/form';

const commonInputStyles = {
    height: 30,
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    marginTop: 5,
    borderRadius: 3
};

const schema = yup.object().shape({
    email: yup.string().email(FORM_FIELDS_LOGIN.email.error).required(FORM_FIELDS_LOGIN.email.error),
});

export const ResetPassword = memo((props) => {
    const { btnTitle = 'Resetear Contraseña!', btnStyle, handlerResetPasswordModalVisible } = props;
    const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState('');
    const { register, handleSubmit, errors, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        setIsResetPasswordModalVisible(true);
        register('email');
    }, [register]);

    function onBackdropPressHandler() {
        setIsResetPasswordModalVisible(false);
    }

    function onSubmit(dataInput) {
        setIsLoading(true);

        if (dataInput) {
            resetPasswordHandler(dataInput)
                .then(() => setIsLoading(false))
                .catch(err => {
                    setIsLoading(false);
                    setErrorText(err);
                });
        }

        setIsLoading(false);
    }

    return (
        <CustomModal
            isModalVisible={isResetPasswordModalVisible} onBackdropPress={() => {
                onBackdropPressHandler();
                handlerResetPasswordModalVisible(false);
            }}
        >
            <Text style={loginText}>Give me my keys back!</Text>
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>E-Mail</Text>
            <TextInput
                style={[errors.email && errors.email.message ? [commonInputStyles, { borderColor: '#D84A05' }] : [commonInputStyles]]}
                onChangeText={text => {
                    setValue('email', text);
                }}
                autoCorrect={false}
                autoCapitalize={'none'}
                placeholder={FORM_FIELDS_LOGIN.email.help}
                autoFocus
            />
            <Text style={{ color: '#D84A05', marginTop: 5, marginBottom: 5 }}>{errors.email && errors.email.message}</Text>

            {isLoading ?
                <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                <CustomButton
                    btnTitle={btnTitle}
                    btnStyle={btnStyle}
                    action={handleSubmit(onSubmit)}
                />
            }
            {
                !!errorText &&
                <View>
                    <Text style={{ textAlign: 'center', margin: 10, color: '#222' }}>{errorText}</Text>
                </View>
            }
        </CustomModal>
    );
});
