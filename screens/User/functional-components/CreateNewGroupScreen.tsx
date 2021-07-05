import React, { memo, useContext, useEffect } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import CustomButton from '../../../components/common/functional-components/CustomButton';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import useGroupForm from '../../../components/User/custom-hooks/useGroupForm';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { btnStyleDefault } from '../../../src/css/styles/customButton';
import { createGroupHandler } from '../../../src/js/Utils/Helpers/actions/groups';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';

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
            title: `${translate('groups.createGroup.title')}`
        });
    }, []);

    async function onSubmit(dataInput: any) {
        if (dataInput) {
            try {
                setIsLoading(true);
                const group = await createGroupHandler(dataInput, user);
                await dispatchContextApp(
                    {
                        type: 'set_new_group',
                        value: {
                            group
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
                >
                    {translate('groups.createGroup.formTexts.groupName')}
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
                    placeholder={translate('groups.createGroup.formTexts.groupNameInfo')}
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
                <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>
                    {translate('groups.createGroup.formTexts.groupDescription')}
                    </Text>
                <TextInput
                    // tslint:disable-next-line:max-line-length
                    style={[errors.description && errors.description.message ? [commonInputStyles, { borderColor: '#D84A05', height: 80 }] : [commonInputStyles, { height: 80 }]]}
                    onChangeText={text => {
                        setValue('description', text);
                    }}
                    multiline
                    autoCorrect={false}
                    numberOfLines={5}
                    placeholder={translate('groups.settings.formTexts.groupDescriptionHelp')}
                />
                <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>{translate('groups.settings.formTexts.editPassword')}</Text>
                <Text style={{ marginTop: 5, fontSize: 12, color: '#666' }}>{translate('groups.settings.formTexts.info.0')}</Text>
                <Text style={{ marginTop: 5, fontSize: 12, color: '#666' }}>{translate('groups.settings.formTexts.info.1')}</Text>
                <Text style={{ marginTop: 5, fontSize: 12, color: '#666' }}>{translate('groups.settings.formTexts.info.2')}</Text>
                <TextInput
                    // tslint:disable-next-line:max-line-length
                    style={[errors.password && errors.password.message ? [commonInputStyles, { borderColor: '#D84A05' }] : [commonInputStyles]]}
                    onChangeText={text => {
                        setValue('password', text);
                    }}
                    autoCorrect={false}
                    secureTextEntry
                    placeholder={translate('groups.settings.formTexts.passwordHelp')}
                />
                <Text
                    style={{
                        color: '#D84A05',
                        marginTop: 5,
                        marginBottom: 5
                    }}>{errors.password && errors.password.message}
                </Text>
                <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>{translate('groups.settings.formTexts.confirmPassword')}</Text>
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
            </ScrollView>
            {isLoading ?
                <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                <CustomButton
                    btnTitle={translate('groups.createGroup.createGroupBtnTitle')}
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
