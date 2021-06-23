import React, { memo, useContext, useEffect } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import CustomButton from '../../../components/common/functional-components/CustomButton';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import useGroupForm from '../../../components/User/custom-hooks/useGroupForm';
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

const CreateNewGroupScreen = (props: any) => {
    const { navigation } = props;
    const { user, dispatchContextApp } = useContext(AppContext) as any;
    const {
        handleSubmit,
        errors,
        errorText,
        isLoading,
        setValue,
        setErrorText,
        setIsLoading
    } = useGroupForm();

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true,
            title: 'Crear un nuevo grupo'
        });
    }, []);

    async function onSubmit(dataInput: any) {
        if (dataInput) {
            try {
                setIsLoading(true);
                const data = await createGroupHandler(dataInput, user);
                await dispatchContextApp(
                    {
                        type: 'set_new_group',
                        value: {
                            group: data
                        }
                    });
                setIsLoading(false);
                setErrorText('');
                return navigation.goBack();
            } catch (error) {
                setIsLoading(false);
                setErrorText(error);
            }
        }
    }

    return (
        <BodyContainer>
            <ScrollView>
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
                    maxLength={50}
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
            </ScrollView>
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
            <KeyboardSpacer />
        </BodyContainer>
    );
};

export default memo(CreateNewGroupScreen);
