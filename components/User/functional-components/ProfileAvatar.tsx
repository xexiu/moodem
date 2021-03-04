/* eslint-disable max-len */
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { avatarContainer, avatarImage } from '../../../src/css/styles/Avatar';
import { btnShadow } from '../../../src/css/styles/common';
import { USER_AVATAR_DEFAULT } from '../../../src/js/Utils/constants/users';
import firebase from '../../../src/js/Utils/Helpers/services/firebase';
import BgImage from '../../common/functional-components/BgImage';

const storage = firebase.storage();
const storageRef = storage.ref();
const avatarUrls = [];

const handleEditAvatar = (navigation, setLoading, user) => {
    setLoading(true);
    if (avatarUrls.length) {
        navigation.navigate('Avatars', {
            avatarUrls,
            user
        });
        setLoading(false);
    } else {
        storageRef.child('assets/images/avatars').listAll().then(data => {
            if (data.items) {
                for (let i = 0; i < data.items.length; i++) {
                    const item = data.items[i];
                    item.getDownloadURL().then(url => {
                        avatarUrls.push({ avatarUrl: url });
                        if (i === data.items.length - 1) {
                            navigation.navigate('Avatars', {
                                avatarUrls,
                                user
                            });
                            setLoading(false);
                        }
                    });
                }
            }
        });
    }
};

export const ProfileAvatar = (props) => {
    const { user, navigation } = props;
    const [loading, setLoading] = useState(false);

    return (
        <View style={[avatarContainer, { marginTop: 5, position: 'relative' }]}>
            <BgImage source={{ uri: user.photoURL || USER_AVATAR_DEFAULT, cache: 'force-cache' }} bgImageStyle={[avatarImage, btnShadow, { position: 'relative' }]}>
                <View style={{ position: 'absolute', right: -10, bottom: 20 }}>
                    <Icon
                        disabled={loading}
                        raised
                        iconStyle={{ paddingTop: 5 }}
                        Component={TouchableScale}
                        name={loading ? 'sync' : 'pencil'}
                        type={loading ? 'ant-desing' : 'entypo'}
                        color='#dd0031'
                        size={15}
                        onPress={() => handleEditAvatar(navigation, setLoading, user)}
                    />
                </View>
                <Text style={{ marginTop: 10, fontSize: 15, color: '#777', textAlign: 'center', width: 145 }} ellipsizeMode='tail' numberOfLines={1}>Hola {user.displayName}!</Text>
            </BgImage>
        </View>
    );
};
