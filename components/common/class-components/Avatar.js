/* eslint-disable max-len */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';
import { BgImage } from '../functional-components/BgImage';
import { btnShadow } from '../../../src/css/styles/common';

function hangleGuestorUser(navigation, user) {
    if (user) {
        navigation.navigate('Profile');
    }

    navigation.navigate('Guest');
}

function handleEditAvatarImage(navigation, user) {
    if (user) {
        // Edit and upload new image/avatar
    }

    navigation.navigate('Guest');
}

export class Avatar extends Component {
    render() {
        const {
            navigation,
            user
        } = this.props;

        return (
            <View>
                <TouchableHighlight underlayColor='#eee' onPress={hangleGuestorUser.bind(this, navigation, user)}>
                    <BgImage
                        source={require('../../../assets/images/avatars/avatar_moodem.png')} bgImageStyle={[
                            {
                                width: 140,
                                height: 140,
                                borderColor: '#eee',
                                borderWidth: 1,
                                borderRadius: 10
                            },
                            btnShadow]}
                    />
                </TouchableHighlight>
                {user && <View style={{ position: 'absolute', right: -10, bottom: -10 }}>
                    <Icon
                        iconStyle={{ paddingTop: 2, paddingLeft: 2 }}
                        raised
                        name='pencil'
                        type='entypo'
                        color='#dd0031'
                        underlayColor='#eee'
                        size={14}
                        onPress={() => console.log('Edit image/avatar')}
                    />
                </View> }
            </View>
        );
    }
}
