/* eslint-disable max-len */
import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { AvatarSideBar } from '../../../components/common/functional-components/AvatarSideBar';
import firebase from '../../../src/js/Utils/Helpers/services/firebase';

export const SideBarTopHeader = (props) => {
    const {
        navigation,
        params
    } = props;

    const handlerGoHome = () => {
        Object.assign(params.group, {
            group_name: 'Moodem',
            group_id: null
        });
        navigation.navigate('Moodem');
    };

    const handleLogOut = () => {
        firebase.auth().signOut().then(() => {
            Object.assign(params.group, {
                group_name: 'Moodem',
                group_id: null
            });
            const drawerClosed = new Promise(resolve => {
                navigation.closeDrawer();
                resolve();
            });
            drawerClosed.then(() => navigation.navigate('Guest'));
        });
    };

    return (
        <View style={{ position: 'relative' }}>
            <View style={{ position: 'absolute' }}>
                <Icon
                    Component={TouchableScale}
                    raised
                    name={'logout'}
                    type={'AntDesign'}
                    size={15}
                    color='#dd0031'
                    onPress={() => handleLogOut(props.navigation)}
                />
            </View>
            <View style={{ position: 'absolute', right: 0 }}>
                <Icon
                    Component={TouchableScale}
                    raised
                    name={'home'}
                    type={'AntDesign'}
                    size={15}
                    color='#dd0031'
                    onPress={() => handlerGoHome(params, navigation)}
                />
            </View>
            <AvatarSideBar navigation={navigation} user={params.user} group={params.group} />
        </View>
    );
};
