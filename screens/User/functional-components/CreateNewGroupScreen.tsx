import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import * as yup from 'yup';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import CustomButton from '../../../components/common/functional-components/CustomButton';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { btnStyleDefault } from '../../../src/css/styles/customButton';
import { FORM_FIELDS_CREATE_GROUP } from '../../../src/js/Utils/constants/form';
import { createGroupHandler } from '../../../src/js/Utils/Helpers/actions/groups';

const commonInputStyles = {
    height: 30,
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    marginTop: 5,
    borderRadius: 3
};

const schema = yup.object().shape({
    name: yup.string()
    .trim()
    .min(5, ({ min }) => `El nombre del grupo ha de ser mayor que ${min} carácteres!`)
    .max(50)
    .required(FORM_FIELDS_CREATE_GROUP.group_name.error),
    description: yup.string().min(0).max(100).optional(),
    password: yup.string()
    .optional()
    .notRequired()
    .matches(/\w*[a-zA-Z]\w*/, 'La contraseña ha de tener almenos una letra.')
    .matches(/\d/, 'La contraseña ha de tener almenos un número.')
    .matches(/^[!@#$%^&*()\-_"=+{}; :,<.>]$/, 'La contraseña no puede contener espacios ni carácteres espaciales.'),
    confirm_password: yup.string().oneOf
        (
            [yup.ref('password'), null],
            FORM_FIELDS_CREATE_GROUP.group_password_confirm.error
        )
        .optional()
        .notRequired()
        .when('password', {
            is: (value: any) => {
                return value === 'undefined' || value === null || value === '';
            },
            then: yup.string().optional().notRequired(),
            otherwise: yup.string().optional().notRequired()
        })
});

const CreateNewGroupScreen = (props: any) => {
    const { navigation } = props;
    const { user, dispatchContextApp } = useContext(AppContext) as any;
    const [isLoading, setIsLoading] = useState(false);
    const [errorText, setErrorText] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            title: 'Crear un nuevo grupo'
        });
        register('name');
        register('description');
        register('password');
        register('confirm_password');
    }, [register]);

    async function onSubmit(dataInput: any) {
        setIsLoading(true);

        if (dataInput) {
            if (dataInput.name === 'Moodem') {
                setIsLoading(false);
                setErrorText('Nombre Moodem está reservado!');
                return;
            }
            try {
                const data = await createGroupHandler(dataInput, user);
                if (data && data.message) {
                    setIsLoading(false);
                    setErrorText(data.message);
                } else {
                    console.log('CREATING GROUP OKKK');
                    setIsLoading(false);
                    setErrorText('');
                    navigation.goBack();
                    dispatchContextApp(
                        {
                            type: 'set_new_group',
                            value: {
                                group: Object.assign(data, {
                                    group_songs: data.group_songs || []
                                })
                            }
                        });
                }
            } catch (err) {
                setIsLoading(false);
                setErrorText(err);
            }
        } else {
            setIsLoading(false);
        }
    }

    return (
        <BodyContainer>
            <View>
                <Text
                    style={{
                        marginTop: 5,
                        fontSize: 15,
                        fontWeight: '500'
                    }}
                >Nombre del grupo:
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
                    placeholder={FORM_FIELDS_CREATE_GROUP.group_name.help}
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
                <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>Descripción del grupo (opcional):</Text>
                <TextInput
                    // tslint:disable-next-line:max-line-length
                    style={[errors.description && errors.description.message ? [commonInputStyles, { borderColor: '#D84A05', height: 80 }] : [commonInputStyles, { height: 80 }]]}
                    onChangeText={text => {
                        setValue('description', text);
                    }}
                    multiline
                    autoCorrect={false}
                    numberOfLines={5}
                    placeholder={FORM_FIELDS_CREATE_GROUP.group_description.help}
                />
                <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>Contraseña:</Text>
                <Text style={{ marginTop: 5, fontSize: 12, color: '#666' }}>- Crear un grupo público: No introducir contraseña!</Text>
                <Text style={{ marginTop: 5, fontSize: 12, color: '#666' }}>- Crear un grupo privado: Crear una contraseña!</Text>
                <Text style={{ marginTop: 5, fontSize: 12, color: '#666' }}>- Contraseña válida: Ha de contener letra(s) y número(s). No puede contener espacios y/o carácteres espaciales!</Text>
                <TextInput
                    // tslint:disable-next-line:max-line-length
                    style={[errors.password && errors.password.message ? [commonInputStyles, { borderColor: '#D84A05' }] : [commonInputStyles]]}
                    onChangeText={text => {
                        setValue('password', text);
                    }}
                    autoCorrect={false}
                    secureTextEntry
                    placeholder={FORM_FIELDS_CREATE_GROUP.group_password.help}
                />
                <Text
                    style={{
                        color: '#D84A05',
                        marginTop: 5,
                        marginBottom: 5
                    }}>{errors.password && errors.password.message}
                </Text>
                <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>Confirmar Contraseña:</Text>
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
            </View>
            {isLoading ?
                <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                <CustomButton
                    btnTitle='Crear Grupo'
                    btnStyle={[btnStyleDefault, { marginTop: 15 }]}
                    action={handleSubmit(onSubmit)}
                />
            }
            {
                !!errorText &&
                <View>
                    <Text style={{ textAlign: 'center', margin: 10, color: '#222' }}>{errorText}</Text>
                </View>
            }
        </BodyContainer>
    );
};

export default memo(CreateNewGroupScreen);
