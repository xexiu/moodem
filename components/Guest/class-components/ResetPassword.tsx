/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import * as yup from 'yup';
import { loginText } from '../../../src/css/styles/login';
import { FORM_FIELDS_LOGIN } from '../../../src/js/Utils/constants/form';
import { resetPasswordHandler } from '../../../src/js/Utils/Helpers/actions/resetPasswordHandler';
import CustomButton from '../../common/functional-components/CustomButton';
import { CustomModal } from '../../common/functional-components/CustomModal';
import PreLoader from '../../common/functional-components/PreLoader';

const commonInputStyles = {
    height: 30,
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    marginTop: 5,
    borderRadius: 3
};

const schema = yup.object().shape({
    email: yup.string().email(FORM_FIELDS_LOGIN.email.error).required(FORM_FIELDS_LOGIN.email.error)
});

const ResetPassword = (props: any) => {
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

    function onSubmit(dataInput: object) {
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
            isModalVisible={isResetPasswordModalVisible}
            onBackdropPress={() => {
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
};

ResetPassword.propTypes = {
    handlerResetPasswordModalVisible: PropTypes.func
};

memo(ResetPassword);

export {
    ResetPassword
};
