/* eslint-disable max-len */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import { Icon } from 'react-native-elements';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { AppContext } from './AppContext';
import { ProfileAvatar } from './ProfileAvatar';
import { VerifyEmailMsg } from './VerifyEmailMsg';

const Profile = (props: any) => {
    const [userNickName, setUserNickName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { navigation } = props;
    const { user } = useContext(AppContext) as any;
    const toastRef = useRef(null);

    useEffect(() => {
        console.log('PROFILE');
    }, [loading]);

    const handleUserNameChange = () => {
        setLoading(true);

        if (userNickName.length < 4) {
            setLoading(false);
            return toastRef.current.show('Ha de ser 4 carácteres o más', 3000);
        }

        return user.updateProfile({
            displayName: userNickName
        }).then(() => {
            setLoading(false);
            setUserNickName('');
            Promise.resolve(toastRef.current.show('Actualizado!', 2000));
        }, (error: any) => {
            setLoading(false);
            setUserNickName('');
            Promise.reject(toastRef.current.show(error.message, 2000));
        });
    };

    const handleUserPasswordChange = () => {
        setLoading(true);

        return user.updatePassword(userPassword).then(() => {
            setLoading(false);
            setUserPassword('');
            Promise.resolve(toastRef.current.show('Actualizado!', 2000));
        }, (error: any) => {
            setLoading(false);
            setUserPassword('');
            Promise.reject(toastRef.current.show(error.message, 2000));
        });
    };

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <Toast
                position='top'
                ref={toastRef}
            />
            <View style={{ marginTop: 30, padding: 10 }}>
                <BurgerMenuIcon action={() => navigation.openDrawer()} />
                <VerifyEmailMsg user={user} />
                <ProfileAvatar user={user} navigation={navigation} />

                <View style={{ position: 'relative', flexDirection: 'row', marginBottom: 10 }}>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            fontStyle: 'italic',
                            padding: 5,
                            borderColor: '#eee',
                            borderRadius: 5,
                            width: '80%'
                        }}
                        underlineColorAndroid='transparent'
                        placeholder='Cambiar nickname'
                        placeholderTextColor='#777'
                        autoCapitalize='none'
                        autoCorrect={false}
                        clearTextOnFocus
                        editable={!loading}
                        value={userNickName}
                        onChangeText={setUserNickName}
                    />
                    <CustomButton
                        btnDisabled={loading}
                        btnTitle= ''
                        btnIcon={
                            (
                                <Icon
                                    iconStyle={{ backgroundColor: 'transparent' }}
                                    name={loading ? 'circle' : 'check'}
                                    type='entypo'
                                    color='white'
                                    size={22}
                                />
                            )
                        }
                        btnStyle={{ width: 50, height: 30, padding: 0, marginLeft: 10 }}
                        btnTitleStyle={{ fontSize: 15 }}
                        action={handleUserNameChange}
                    />
                </View>

                <View style={{ position: 'relative', flexDirection: 'row', marginBottom: 10 }}>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            fontStyle: 'italic',
                            padding: 5,
                            borderColor: '#eee',
                            borderRadius: 5,
                            width: '80%'
                        }}
                        underlineColorAndroid='transparent'
                        placeholder='Cambiar Email'
                        placeholderTextColor='#777'
                        autoCapitalize='none'
                        editable={false}
                        onChangeText={text => console.log('Email', text)}
                    />
                    <CustomButton
                        btnDisabled={!user.emailVerified}
                        btnTitle=''
                        btnIcon={
                            (
                                <Icon
                                    iconStyle={{ backgroundColor: 'transparent' }}
                                    name={user.emailVerified ? 'check' : 'lock'}
                                    type='entypo'
                                    color='white'
                                    size={22}
                                />
                            )
                        }
                        btnStyle={{ width: 50, height: 30, padding: 0, marginLeft: 10 }}
                        btnTitleStyle={{ fontSize: 15 }}
                    />
                </View>

                <View style={{ position: 'relative', flexDirection: 'row', marginBottom: 10 }}>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            fontStyle: 'italic',
                            padding: 5,
                            borderColor: '#eee',
                            borderRadius: 5,
                            width: '80%'
                        }}
                        underlineColorAndroid='transparent'
                        placeholder='Cambiar contraseña'
                        placeholderTextColor='#777'
                        autoCapitalize='none'
                        secureTextEntry
                        autoCorrect={false}
                        clearTextOnFocus
                        editable={!loading}
                        value={userPassword}
                        onChangeText={setUserPassword}
                    />
                    <CustomButton
                        btnDisabled={loading}
                        btnTitle=''
                        btnIcon={
                            (
                                <Icon
                                    iconStyle={{ backgroundColor: 'transparent' }}
                                    name='check'
                                    type='entypo'
                                    color='white'
                                    size={22}
                                />
                            )
                        }
                        btnStyle={{ width: 50, height: 30, padding: 0, marginLeft: 10 }}
                        btnTitleStyle={{ fontSize: 15 }}
                        action={handleUserPasswordChange}
                    />
                </View>

                {/*
                TODO: Fetch Owned/Invited Groups and list them
                */}

                <View
                    style={{
                        position: 'relative',
                        marginTop: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                        paddingBottom: 4
                    }}>
                    <Text style={{ fontSize: 18 }}>Mis Grupos Administrados</Text>
                    <Text style={{ fontSize: 12, fontStyle: 'italic' }}>Próximamente...</Text>
                </View>
                <View
                    style={{
                        position: 'relative',
                        marginTop: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                        paddingBottom: 4
                    }}>
                    <Text style={{ fontSize: 18 }}>Grupos Externos</Text>
                    <Text style={{ fontSize: 12, fontStyle: 'italic' }}>Próximamente...</Text>
                </View>
            </View>
        </View>
    );
};

Profile.navigationOptions = ({ route }) => ({
    headerMode: 'none',
    headerShown: false,
    title: 'Mi Perfil'
});

export {
    Profile
};
