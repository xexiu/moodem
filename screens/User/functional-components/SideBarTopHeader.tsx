/* eslint-disable max-len */
import React, { useContext } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { AvatarSideBar } from '../../../components/common/functional-components/AvatarSideBar';
import { AppContext } from '../../../components/User/functional-components/AppContext';
import firebase from '../../../src/js/Utils/Helpers/services/firebase';

export const SideBarTopHeader = (props: any) => {
    const { dispatch }: any = useContext(AppContext);
    const {
        navigation,
        params
    } = props;

    const handlerGoHome = () => {
        const reset = new Promise(resolve => {
            dispatch({
                type: 'group', value: {
                    group_name: 'Moodem',
                    group_id: null
                }
            });
            resolve(true);
        });
        reset.then(() => {
            navigation.closeDrawer();
            navigation.navigate('Moodem');
        });
    };

    const handleLogOut = () => {
        return firebase.auth().signOut().then(() => {
            const reset = new Promise(resolve => {
                dispatch({ type: 'reset' });
                resolve(true);
            });
            reset.then(() => {
                navigation.navigate('Guest');
            });
        });
    };

    return (
        <View style={{ position: 'relative' }}>
            {params.user && <View style={{ position: 'absolute' }}>
                <Icon
                    Component={TouchableScale}
                    raised
                    name={'logout'}
                    type={'AntDesign'}
                    size={15}
                    color='#dd0031'
                    onPress={() => handleLogOut()}
                />
            </View>}
            <View style={{ position: 'absolute', right: 0 }}>
                <Icon
                    Component={TouchableScale}
                    raised
                    name={'home'}
                    type={'AntDesign'}
                    size={15}
                    color='#dd0031'
                    onPress={handlerGoHome}
                />
            </View>
            <AvatarSideBar navigation={navigation} user={params.user} group={params.group} />
        </View>
    );
};
