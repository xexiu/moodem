import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import * as yup from 'yup';
import { registerText } from '../../../src/css/styles/register';
import { FORM_FIELDS_REGISTER } from '../../../src/js/Utils/constants/form';
import {
    addUserToJoinedGroupDB
} from '../../../src/js/Utils/Helpers/actions/groups';
import {
    registerNewUser,
    saveNewUserOnDB,
    updateProfile
} from '../../../src/js/Utils/Helpers/actions/users';
import CustomButton from '../../common/functional-components/CustomButton';
import PreLoader from '../../common/functional-components/PreLoader';

const controller = new AbortController();

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

const FormRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        register('name');
        register('email');
        register('password');
        register('confirm_password');

        return () => {
            controller.abort();
        };
    }, [register]);

    async function onSubmit(dataInput: object) {
        if (dataInput) {
            setIsLoading(true);
            try {
                const auth = await registerNewUser(dataInput);
                if (auth && auth.message) {
                    setIsLoading(false);
                    setErrorText(auth.message);
                } else {
                    await updateProfile(auth, dataInput);
                    setIsLoading(false);
                    setErrorText('');
                    await saveNewUserOnDB(auth.user, dataInput);
                    await addUserToJoinedGroupDB({
                        group_name: 'Moodem',
                        group_id: '-MbrDH40rJYRzCq-v58a'
                    }, auth.user);
                }
            } catch (error) {
                console.error('FormRegisterUser Error', JSON.stringify(error));
                setIsLoading(false);
                setErrorText(error);
            }
        }
    }

    return (
        <View>
            <Text style={registerText}>Knock Knock!!</Text>
            <Text
                style={{
                    marginTop: 5,
                    fontSize: 15,
                    fontWeight: '500'
                }}
            >Nombre (max. 30 carácteres)
            </Text>
            <TextInput
                style={[
                    errors.name && errors.name.message ?
                        [commonInputStyles, { borderColor: '#D84A05' }] :
                        [commonInputStyles]]}
                onChangeText={text => {
                    setValue('name', text);
                }}
                autoCorrect={false}
                autoFocus
                maxLength={30}
                placeholder={FORM_FIELDS_REGISTER.name.help}
            />
            <Text
                style={{
                    color: '#D84A05',
                    marginTop: 5,
                    marginBottom: 5
                }}
            >
                {errors.name && errors.name.message}
            </Text>
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
                placeholder={FORM_FIELDS_REGISTER.email.help}
            />
            <Text
                style={{
                    color: '#D84A05',
                    marginTop: 5,
                    marginBottom: 5
                }}>{errors.email && errors.email.message}
            </Text>
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>Contraseña</Text>
            <TextInput
                style={[errors.password && errors.password.message ?
                    [commonInputStyles, { borderColor: '#D84A05' }] : [commonInputStyles]]}
                onChangeText={text => {
                    setValue('password', text);
                }}
                autoCorrect={false}
                secureTextEntry
                placeholder={FORM_FIELDS_REGISTER.password.help}
            />
            <Text
                style={{
                    color: '#D84A05',
                    marginTop: 5,
                    marginBottom: 5
                }}>{errors.password && errors.password.message}
            </Text>
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>Confirmar Contraseña</Text>
            <TextInput
                style={[errors.confirm_password && errors.confirm_password.message ?
                    [commonInputStyles, { borderColor: '#D84A05' }] :
                    [commonInputStyles]]}
                onChangeText={text => {
                    setValue('confirm_password', text);
                }}
                autoCorrect={false}
                secureTextEntry
            />
            <Text
                style={{
                    color: '#D84A05',
                    marginTop: 5,
                    marginBottom: 5
                }}>{errors.confirm_password && errors.confirm_password.message}
            </Text>
            {
                !!errorText &&
                <View>
                    <Text style={{ textAlign: 'center', margin: 10, color: '#222' }}>{errorText}</Text>
                </View>
            }
            {isLoading ?
                <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                <CustomButton
                    btnTitle='Registrarme'
                    btnStyle={[{ backgroundColor: '#00b7e0' }, { marginTop: 15 }]}
                    action={handleSubmit(onSubmit)}
                />
            }
        </View>
    );
};

export default memo(FormRegister);
