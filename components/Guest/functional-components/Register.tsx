/* eslint-disable max-len */
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TextInput, View } from 'react-native';
import * as yup from 'yup';
import { btnStyleDefault } from '../../../src/css/styles/customButton';
import { registerText } from '../../../src/css/styles/register';
import { FORM_FIELDS_REGISTER } from '../../../src/js/Utils/constants/form';
import { registerHandler } from '../../../src/js/Utils/Helpers/actions/registerHandler';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { CustomModal } from '../../common/functional-components/CustomModal';
import { PreLoader } from '../../common/functional-components/PreLoader';

const commonInputStyles = {
    height: 30,
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    marginTop: 5,
    borderRadius: 3
};

const schema = yup.object().shape({
    name: yup.string().min(3).max(30).required(FORM_FIELDS_REGISTER.name.error),
    email: yup.string().email(FORM_FIELDS_REGISTER.email.error).required(FORM_FIELDS_REGISTER.email.error),
    password: yup.string().min(6).required(FORM_FIELDS_REGISTER.password.error),
    confirm_password: yup.string().oneOf([yup.ref('password'), null], FORM_FIELDS_REGISTER.confirmar_password.error)
        .required(FORM_FIELDS_REGISTER.confirmar_password.help)
});

const Register = (props: any) => {
    const { btnTitle, btnStyle, navigation } = props;
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState('');
    const { register, handleSubmit, errors, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        register('name');
        register('email');
        register('password');
        register('confirm_password');
    }, [register]);

    function onBackdropPressHandler() {
        setIsRegisterModalVisible(false);
    }

    function toggleModal() {
        setIsRegisterModalVisible(!isRegisterModalVisible);
    }

    function onSubmit(dataInput: object) {
        setIsLoading(true);

        if (dataInput) {
            registerHandler(dataInput)
                .then((data: any) => {
                    setIsLoading(false);
                    setIsRegisterModalVisible(false);
                    setErrorText('');
                    navigation.navigate('Drawer', {
                        screen: 'Moodem',
                        params: {
                            user: data.user
                        }
                    });
                })
                .catch(err => {
                    setIsLoading(false);
                    setErrorText(err);
                });
        } else {
            setIsLoading(false);
        }
    }

    return (
        <ScrollView>
            <View>
                <CustomButton
                    btnTitle={btnTitle}
                    btnStyle={[btnStyleDefault, btnStyle]}
                    action={toggleModal}
                />

                <CustomModal isModalVisible={isRegisterModalVisible} onBackdropPress={onBackdropPressHandler}>
                    <View>
                        <Text style={registerText}>Knock Knock!!</Text>
                        <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>Nombre (max. 30 carácteres)</Text>
                        <TextInput
                            style={[errors.name && errors.name.message ? [commonInputStyles, { borderColor: '#D84A05' }] : [commonInputStyles]]}
                            onChangeText={text => {
                                setValue('name', text);
                            }}
                            autoCorrect={false}
                            autoFocus
                            maxLength={30}
                            placeholder={FORM_FIELDS_REGISTER.name.help}
                        />
                        <Text style={{ color: '#D84A05', marginTop: 5, marginBottom: 5 }}>{errors.name && errors.name.message}</Text>
                        <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>E-Mail</Text>
                        <TextInput
                            style={[errors.email && errors.email.message ? [commonInputStyles, { borderColor: '#D84A05' }] : [commonInputStyles]]}
                            onChangeText={text => {
                                setValue('email', text);
                            }}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            placeholder={FORM_FIELDS_REGISTER.email.help}
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
                            placeholder={FORM_FIELDS_REGISTER.password.help}
                        />
                        <Text style={{ color: '#D84A05', marginTop: 5, marginBottom: 5 }}>{errors.password && errors.password.message}</Text>
                        <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>Confirmar Contraseña</Text>
                        <TextInput
                            style={[errors.confirm_password && errors.confirm_password.message ? [commonInputStyles, { borderColor: '#D84A05' }] : [commonInputStyles]]}
                            onChangeText={text => {
                                setValue('confirm_password', text);
                            }}
                            autoCorrect={false}
                            secureTextEntry
                        />
                        <Text style={{ color: '#D84A05', marginTop: 5, marginBottom: 5 }}>{errors.confirm_password && errors.confirm_password.message}</Text>
                    </View>

                    {isLoading ?
                        <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                        <CustomButton
                            btnTitle='Registrarme'
                            btnStyle={[btnStyleDefault, btnStyle, { marginTop: 15 }]}
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
            </View>
        </ScrollView>
    );
};

Register.propTypes = {
    btnTitle: PropTypes.string,
    btnStyle: PropTypes.object,
    navigation: PropTypes.object
};

memo(Register);

export {
    Register
};
