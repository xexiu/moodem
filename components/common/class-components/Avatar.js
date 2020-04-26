/* eslint-disable max-len */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { View, TouchableHighlight } from 'react-native';
import { BgImage } from '../functional-components/BgImage';
import { btnShadow } from '../../../src/css/styles/common';
import { avatarContainer, avatarImage } from '../../../src/css/styles/Avatar';

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

        return (
            <View style={avatarContainer}>
                <TouchableHighlight underlayColor='#eee' onPress={hangleUserNavigation.bind(this, navigation, user, groupName)}>
                    <BgImage source={require('../../../assets/images/avatars/avatar_moodem.png')} bgImageStyle={[avatarImage, btnShadow]} />
                </TouchableHighlight>
            </View>
        );
    }
}
