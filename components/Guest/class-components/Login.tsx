/* eslint-disable max-len */
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TextInput, TouchableHighlight, View } from 'react-native';
import * as yup from 'yup';
import CustomButton from '../../../components/common/functional-components/CustomButton';
import { CustomModal } from '../../../components/common/functional-components/CustomModal';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import { ResetPassword } from '../../../components/Guest/class-components/ResetPassword';
import { loginText } from '../../../src/css/styles/login';
import { FORM_FIELDS_LOGIN } from '../../../src/js/Utils/constants/form';
import { loginHandler } from '../../../src/js/Utils/Helpers/actions/loginHandler';

const commonInputStyles = {
    height: 30,
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    marginTop: 5,
    borderRadius: 3
};

const schema = yup.object().shape({
    email: yup.string().email(FORM_FIELDS_LOGIN.email.error).required(FORM_FIELDS_LOGIN.email.error),
    password: yup.string().min(6).required(FORM_FIELDS_LOGIN.password.error)
});

const Login = (props: any) => {
    const { btnTitle, btnStyle, navigation } = props;
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [hasForgotPassword, sethasForgotPassword] = useState(false);
    const { register, handleSubmit, errors, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        register('email');
        register('password');
    }, [register]);

    function onBackdropPressHandler() {
        setIsLoginModalVisible(false);
        sethasForgotPassword(false);
    }

    function toggleModal() {
        setIsLoginModalVisible(!isLoginModalVisible);
    }

    function onSubmit(dataInput: object) {
        setIsLoading(true);

        if (dataInput) {
            loginHandler(dataInput)
                .then(user => {
                    setIsLoading(false);
                    setIsLoginModalVisible(false);
                    setErrorText('');
                    sethasForgotPassword(false);
                    navigation.navigate('Drawer', {
                        screen: 'Moodem',
                        params: {
                            user
                        }
                    });
                })
                .catch(error => {
                    setIsLoading(false);
                    console.log('ERROR', error);
                    if (error.code === 'auth/wrong-password' || error.code === 'auth/too-many-requests') {
                        sethasForgotPassword(true);
                        setErrorText(error.message);
                    } else {
                        sethasForgotPassword(true);
                        setErrorText(error.message);
                    }
                });
        } else {
            setIsLoading(false);
        }
    }

    return (
        <View style={{ alignItems: 'center', padding: 5 }}>
            <CustomButton
                btnTitle={btnTitle}
                btnStyle={btnStyle}
                action={toggleModal}
            />

            <CustomModal
                isModalVisible={isLoginModalVisible}
                onBackdropPress={onBackdropPressHandler}
                onModalHide={() => {
                    if (hasForgotPassword) {
                        setIsResetPasswordModalVisible(true);
                    }
                }}
            >
                <View>
                    <Text style={loginText}>Tú tienes las llaves!</Text>
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
                    <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>Contraseña</Text>
                    <TextInput
                        style={[errors.password && errors.password.message ? [commonInputStyles, { borderColor: '#D84A05' }] : [commonInputStyles]]}
                        onChangeText={text => {
                            setValue('password', text);
                        }}
                        autoCorrect={false}
                        secureTextEntry
                        placeholder={FORM_FIELDS_LOGIN.password.help}
                    />
                    <Text style={{ color: '#D84A05', marginTop: 5, marginBottom: 5 }}>{errors.password && errors.password.message}</Text>
                </View>

                {isLoading ?
                    <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                    <CustomButton
                        btnTitle='Iniciar Sesión'
                        btnStyle={btnStyle}
                        action={handleSubmit(onSubmit)}
                    />
                }
                {
                    hasForgotPassword &&
                    <View>
                        <Text style={{ textAlign: 'center', margin: 10, color: '#222' }}>{errorText}</Text>
                        <TouchableHighlight
                            underlayColor={'#f0f0f0'}
                            onPress={() => setIsLoginModalVisible(false)}
                        >
                            <Text style={{ textAlign: 'center', margin: 10, color: '#dd0031' }}>Forgot password?</Text>
                        </TouchableHighlight>
                    </View>
                }
            </CustomModal>

            {isResetPasswordModalVisible && <ResetPassword handlerResetPasswordModalVisible={setIsResetPasswordModalVisible} />}
        </View>
    );
};

Login.propTypes = {
    btnTitle: PropTypes.string,
    btnStyle: PropTypes.object,
    navigation: PropTypes.object
};

export default memo(Login);
