/* eslint-disable max-len */
import React from 'react';
import { View } from 'react-native';
import { Logout } from '../../../components/User/functional-components/Logout';
import { Home } from '../../../components/User/functional-components/Home';
import { AvatarSideBar } from '../../../components/common/functional-components/AvatarSideBar';

export const SideBarTopHeader = (props) => {
    const {
        navigation,
        params,
        group,
        signOut,
        goHome
    } = props;

    return (
        <View style={{ position: 'relative' }}>
            <Logout action={signOut.bind(this, navigation)} />
            {group.group_name !== 'Moodem' && <Home action={goHome.bind(this, navigation)} />}
            <AvatarSideBar navigation={navigation} user={params.user} group={group} />
        </View>
    );
};
