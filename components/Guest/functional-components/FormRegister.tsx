import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import * as yup from 'yup';
import { registerText } from '../../../src/css/styles/register';
import { addUserToJoinedGroupDB } from '../../../src/js/Utils/Helpers/actions/groups';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import { saveNewUserOnDB, updateProfile } from '../../../src/js/Utils/Helpers/actions/users';
import { auth } from '../../../src/js/Utils/Helpers/services/firebase';
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
    name: yup.string().min(3).max(30).required(translate('register.inputNameError')),
    email: yup.string().email(translate('register.inputEmailError')).required(translate('register.inputEmailError')),
    password: yup.string().min(6).required(translate('register.inputPasswordError')),
    confirm_password: yup.string().oneOf([yup.ref('password'), null], translate('register.inputConfirmPasswordError'))
        .required(translate('register.inputConfirmPasswordError'))
});

const FormRegister = ({ initMoodem }: any) => {
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

    async function onSubmit(data: any) {
        if (data) {
            setIsLoading(true);
            try {
                const _auth = await auth().createUserWithEmailAndPassword(data.email, data.password);
                await updateProfile(_auth, data);
                const { _user } = auth().currentUser || null as any;
                await saveNewUserOnDB(_user, data);
                await addUserToJoinedGroupDB({
                    group_name: 'Moodem',
                    group_id: '-MbrDH40rJYRzCq-v58a'
                }, _user);
                setErrorText('');
                return initMoodem();
            } catch (error) {
                console.log('FormRegisterUser Error', error);
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
            <Text style={registerText}>Knock Knock!!</Text>
            <Text
                style={{
                    marginTop: 5,
                    fontSize: 15,
                    fontWeight: '500'
                }}
            >{translate('register.inputName')}
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
                placeholder={translate('register.placeholderInputName')}
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
                placeholder={translate('register.placeholderInputEmail')}
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
                    [commonInputStyles, { borderColor: '#D84A05' }] : [commonInputStyles]]}
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
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>{translate('register.inputConfirmPassword')}</Text>
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
                }}
            >
                {errors.confirm_password && errors.confirm_password.message}
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
                    btnDisabled={isLoading}
                    btnTitle={translate('register.title')}
                    btnStyle={[{ backgroundColor: '#00b7e0' }, { marginTop: 15 }]}
                    action={handleSubmit(onSubmit)}
                />
            }
        </View>
    );
};

export default memo(FormRegister);
