/* eslint-disable max-len */
import Toast from 'react-native-easy-toast';
import React, { useContext, useState, useRef } from 'react';
import { View, Text, TextInput } from 'react-native';
import { UserContext } from './UserContext';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';
import { VerifyEmailMsg } from './VerifyEmailMsg';
import { ProfileAvatar } from './ProfileAvatar';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { CustomButton } from '../../common/functional-components/CustomButton';

const Profile = (props) => {
    const [userNickName, setUserNickName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { navigation } = props;
    const { user } = useContext(UserContext);
    const toastRef = useRef(null);

    const handleUserNameChange = () => {
        setLoading(true);

        if (userNickName.length < 6) {
            setLoading(false);
            return toastRef.current.show('The NickName must be 6 characters long or more.', 2000);
        }

        user.updateProfile({
            displayName: userNickName
        }).then(() => {
            setLoading(false);
            setUserNickName('');
            toastRef.current.show('NickName updated successfully!', 2000);
        }, (error) => {
            setLoading(false);
            setUserNickName('');
            toastRef.current.show(error.message, 2000);
        });
    };

    const handleUserPasswordChange = () => {
        setLoading(true);

        user.updatePassword(userPassword).then(() => {
            setLoading(false);
            setUserPassword('');
            toastRef.current.show('Password updated successfully!', 2000);
        }, (error) => {
            setLoading(false);
            setUserPassword('');
            toastRef.current.show(error.message, 2000);
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
                        style={{ borderWidth: 1, fontStyle: 'italic', padding: 5, borderColor: '#eee', borderRadius: 5, width: '80%' }}
                        underlineColorAndroid="transparent"
                        placeholder="Change NickName"
                        placeholderTextColor="#777"
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearTextOnFocus
                        editable={!loading}
                        value={userNickName}
                        onChangeText={(text) => setUserNickName(text)}
                    />
                    <CustomButton
                        btnDisabled={loading}
                        btnTitle="Save"
                        btnStyle={{ width: 50, height: 30, padding: 0, marginLeft: 10 }}
                        btnTitleStyle={{ fontSize: 15 }} ç
                        action={() => handleUserNameChange(userNickName, user, setLoading, setUserNickName)}
                    />
                </View>

                <View style={{ position: 'relative', flexDirection: 'row', marginBottom: 10 }}>
                    <TextInput
                        style={{ borderWidth: 1, fontStyle: 'italic', padding: 5, borderColor: '#eee', borderRadius: 5, width: '80%' }}
                        underlineColorAndroid="transparent"
                        placeholder="Change Email"
                        placeholderTextColor="#777"
                        autoCapitalize="none"
                        editable={false}
                        onChangeText={text => console.log('Email', text)}
                    />
                    <CustomButton
                        btnDisabled={!user.emailVerified}
                        btnTitle="Save"
                        btnStyle={{ width: 50, height: 30, padding: 0, marginLeft: 10 }}
                        btnTitleStyle={{ fontSize: 15 }}
                    />
                </View>

                <View style={{ position: 'relative', flexDirection: 'row', marginBottom: 10 }}>
                    <TextInput
                        style={{ borderWidth: 1, fontStyle: 'italic', padding: 5, borderColor: '#eee', borderRadius: 5, width: '80%' }}
                        underlineColorAndroid="transparent"
                        placeholder="Change Password"
                        placeholderTextColor="#777"
                        autoCapitalize="none"
                        secureTextEntry
                        autoCorrect={false}
                        clearTextOnFocus
                        editable={!loading}
                        value={userPassword}
                        onChangeText={(text) => setUserPassword(text)}
                    />
                    <CustomButton
                        btnDisabled={loading}
                        btnTitle="Save"
                        btnStyle={{ width: 50, height: 30, padding: 0, marginLeft: 10 }}
                        btnTitleStyle={{ fontSize: 15 }}
                        action={() => handleUserPasswordChange(userPassword, user, setLoading, setUserPassword)}
                    />
                </View>

                {/*
                TODO: Fetch Owned/Invited Groups and list them
                */}

                <View style={{ position: 'relative', marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 4 }}>
                    <Text style={{ fontSize: 18 }}>Owned Groups</Text>
                    <Text style={{ fontSize: 12, fontStyle: 'italic' }}>Working...</Text>
                </View>
                <View style={{ position: 'relative', marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 4 }}>
                    <Text style={{ fontSize: 18 }}>Invited Groups</Text>
                    <Text style={{ fontSize: 12, fontStyle: 'italic' }}>Working...</Text>
                </View>
            </View>
        </View>
    );
};

Profile.navigationOptions = ({ route }) => ({
    headerMode: 'none',
    headerShown: false,
    title: getGroupName(route.params.group.group_name, 'Profile')
});

export {
    Profile
};
