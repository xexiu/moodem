/* eslint-disable max-len */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { BgImage } from '../functional-components/BgImage';
import { btnShadow } from '../../../src/css/styles/common';
import { avatarContainer, avatarImage } from '../../../src/css/styles/Avatar';
import { USER_AVATAR_DEFAULT } from '../../../src/js/Utils/constants/users';

function hangleUserNavigation(navigation, user, groupName) {
    if (user) {
        navigation.navigate('Profile', {
            params: groupName
        });
    } else {
        navigation.navigate('Guest');
    }
}

export class Avatar extends Component {
    render() {
        const {
            navigation,
            user,
            groupName
        } = this.props;

        console.log('user displayname', user && user.displayName);

        return (
            <View style={avatarContainer}>
                <TouchableHighlight underlayColor='#eee' onPress={hangleUserNavigation.bind(this, navigation, user, groupName)}>
                    <BgImage source={{ uri: USER_AVATAR_DEFAULT }} bgImageStyle={[avatarImage, btnShadow]}>
                        {groupName !== 'Moodem' ?
                            <Text style={{ marginTop: 10, fontSize: 20, color: '#777', textAlign: 'center', width: 145 }} ellipsizeMode='tail' numberOfLines={1}>Hi! {groupName}</Text>
                            :
                            <Text style={{ marginTop: 10, fontSize: 20, color: '#777', textAlign: 'center', width: 145 }} ellipsizeMode='tail' numberOfLines={1}>Hi! {user ? user.displayName : 'Guest'}</Text>}
                    </BgImage>
                </TouchableHighlight>
            </View>
        );
    }
}
