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
        group
    } = props;

    return (
        <View style={{ position: 'relative' }}>
            <Logout navigation={navigation} group={group} />
            <Home {...props} />
            <AvatarSideBar navigation={navigation} user={params.user} group={group} />
        </View>
    );
};
