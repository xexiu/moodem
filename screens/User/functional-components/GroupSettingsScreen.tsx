import { useNavigation } from '@react-navigation/native';
import React, { memo, useContext, useEffect } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import CustomButton from '../../../components/common/functional-components/CustomButton';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import useGroupForm from '../../../components/User/custom-hooks/useGroupForm';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { btnStyleDefault } from '../../../src/css/styles/customButton';
import { FORM_FIELDS_CREATE_GROUP } from '../../../src/js/Utils/constants/form';
import { deleteGroupForEver, updateUserGroup } from '../../../src/js/Utils/Helpers/actions/groups';

const commonInputStyles = {
    height: 30,
    borderColor: '#ddd',
    borderBottomWidth: 0.5,
    marginTop: 5,
    borderRadius: 3
};
const GroupSettingsScreen = (props: any) => {
    const {
        group
    } = props.route.params;
    const { dispatchContextApp } = useContext(AppContext) as any;
    const {
        handleSubmit,
        errors,
        errorText,
        isLoading,
        setValue,
        setErrorText,
        setIsLoading
    } = useGroupForm();
    const navigation = useNavigation<any>();

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true,
            title: 'Ajustes'
        });
    }, []);

    function handleUserAvatar() {
        Alert.alert(
            `Esta acción no se puede deshacer y elimina TODO lo relacionado con este grupo. \n\n ${group.group_name} \n\n ¿Seguro que quiere eliminar este grupo de tú lista?`,
            undefined,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK', onPress: async () => {
                        await deleteGroupForEver(group);
                        await dispatchContextApp(
                            {
                                type: 'delete_owned_group',
                                value: {
                                    group
                                }
                            });
                        return navigation.goBack();
                    }
                }
            ],
            { cancelable: false }
        );
    }

    async function onSubmit(dataInput: any) {
        if (dataInput) {
            try {
                setIsLoading(true);
                const data = await updateUserGroup(group, dataInput);
                await dispatchContextApp(
                    {
                        type: 'update_owned_group',
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
                >Editar nombre del grupo:
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
                    placeholder={group.group_name}
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
                <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>Editar descripción del grupo (opcional):</Text>
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
                {
                    !group.group_password ?
                        <Text style={{ marginTop: 5, fontSize: 12, color: '#666' }}>- Este grupo es público! Si crea una contraseña, el grupo se convertirá en privado!</Text> :
                        <Text style={{ marginTop: 5, fontSize: 12, color: '#666' }}>- Actualizar contraseña!</Text>
                }
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
                    }}
                >
                    {errors.confirm_password && errors.confirm_password.message}
                </Text>
                <CustomButton
                    btnTitle='Eliminar Grupo!'
                    btnStyle={{ backgroundColor: 'transparent', marginTop: 10 }}
                    btnRaised={false}
                    shadow={{}}
                    btnTitleStyle={{ color: '#dd0031', fontSize: 16 }}
                    action={handleUserAvatar}
                />
            </ScrollView>
            {isLoading ?
                <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                <CustomButton
                    btnTitle='Editar Grupo'
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

export default memo(GroupSettingsScreen);
