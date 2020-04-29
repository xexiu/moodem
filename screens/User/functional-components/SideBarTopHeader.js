/* eslint-disable max-len */
import React from 'react';
import { View } from 'react-native';
import { Logout } from '../../../components/User/functional-components/Logout';
import { Home } from '../../../components/User/functional-components/Home';
import { Avatar } from '../../../components/common/class-components/Avatar';

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
            <Avatar navigation={navigation} user={params.user} group={group} />
        </View>
    );
};
