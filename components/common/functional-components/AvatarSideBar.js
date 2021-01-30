/* eslint-disable max-len */
/* eslint-disable global-require */
import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { BgImage } from './BgImage';
import { btnShadow } from '../../../src/css/styles/common';
import { avatarContainer, avatarImage } from '../../../src/css/styles/Avatar';
import { USER_AVATAR_DEFAULT } from '../../../src/js/Utils/constants/users';

function hangleUserNavigation(navigation, user, group) {
    if (user) {
        navigation.navigate('Profile', {
            params: group
        });
    } else {
        navigation.navigate('Guest');
    }
}

export const AvatarSideBar = (props) => {
    const {
        navigation,
        user,
        group
    } = props;

    return (
        <View style={avatarContainer}>
            <TouchableHighlight underlayColor='#eee' onPress={hangleUserNavigation.bind(this, navigation, user, group)}>
                <BgImage source={{ uri: user.photoURL || USER_AVATAR_DEFAULT, cache: 'force-cache' }} bgImageStyle={[avatarImage, btnShadow]}>
                    <Text style={{ marginTop: 10, fontSize: 20, color: '#777', textAlign: 'center', width: 145 }} ellipsizeMode='tail' numberOfLines={1}>Hi! {user ? user.displayName : 'Guest'}</Text>
                </BgImage>
            </TouchableHighlight>
        </View>
    );
};
