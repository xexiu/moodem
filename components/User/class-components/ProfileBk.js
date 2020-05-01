/* eslint-disable max-len */
/* eslint-disable global-require */
import React, { Component, useContext } from 'react';
import { View, Text, TextInput } from 'react-native';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';
import { VerifyEmailMsg } from '../functional-components/VerifyEmailMsg';
import { ProfileAvatar } from '../functional-components/ProfileAvatar';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { GroupsContext } from '../functional-components/GroupsContext';
import { WebView } from 'react-native-webview';
// <WebView
//         originWhitelist={['*']} <--- This must be set when using html prop
//         source={{ html: '<iframe width="400" height="300" src="https://www.youtube.com/embed/cqyziA30whE" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>,<iframe width="400" height="300" src="http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>' }}
//         style={{ marginTop: 120 }}
// />


export class ProfileBk extends Component {
    static navigationOptions = ({ route }) => ({
        headerMode: 'none',
        headerShown: false,
        title: getGroupName(route.params.group.group_name, 'Profile')
    });

    constructor(props) {
        super(props);

        this.state = {
            hasVerifiedEmail: false,
            user: this.props.route.params.user,
            userNickName: ''
        };
    }

    render() {
        const {
            hasVerifiedEmail,
            user,
            userNickName
        } = this.state;
        const {
            navigation
        } = this.props;

        console.log('render Profile()', this.groups);

        return (
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
                <View style={{ marginTop: 30, padding: 10 }}>
                    <BurgerMenuIcon action={() => navigation.openDrawer()} />
                    {!hasVerifiedEmail && <VerifyEmailMsg user={user} />}
                    <ProfileAvatar user={user} />

                    <View style={{ position: 'relative', flexDirection: 'row', marginBottom: 10 }}>
                        <TextInput
                            style={{ borderWidth: 1, fontStyle: 'italic', padding: 5, borderColor: '#eee', borderRadius: 5, width: '80%' }}
                            underlineColorAndroid="transparent"
                            placeholder="Change NickName"
                            placeholderTextColor="#777"
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearTextOnFocus
                            onChangeText={(text) => this.setState({ userNickName: text })}
                        />
                        <CustomButton
                            btnTitle="Save"
                            btnStyle={{ width: 50, height: 30, padding: 0, marginLeft: 10 }}
                            btnTitleStyle={{ fontSize: 15 }} ç
                            action={() => console.log('Nickname', userNickName)}
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
                            onChangeText={this.handleEmail}
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
                            onChangeText={this.handleEmail}
                        />
                        <CustomButton btnTitle="Save" btnStyle={{ width: 50, height: 30, padding: 0, marginLeft: 10 }} btnTitleStyle={{ fontSize: 15 }} />
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
    }
}
