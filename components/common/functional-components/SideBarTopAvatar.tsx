/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { avatarContainer, avatarImage } from '../../../src/css/styles/Avatar';
import { btnShadow } from '../../../src/css/styles/common';
import { USER_AVATAR_DEFAULT } from '../../../src/js/Utils/constants/users';
import BgImage from './BgImage';

const SideBarTopAvatar = (props: any) => {
    const { navigation } = props;

    const { user, group }: any = useContext(AppContext);

    function hangleUserNavigation() {
        if (user) {
            navigation.navigate('Profile', {
                params: group
            });
        } else {
            navigation.navigate('Guest');
        }
    }

    return (
        <View style={avatarContainer}>
            <TouchableHighlight underlayColor='#eee' onPress={hangleUserNavigation}>
                <BgImage
                    source={{ uri: user && user.photoURL || USER_AVATAR_DEFAULT, cache: 'force-cache' }}
                    bgImageStyle={[avatarImage, btnShadow]}
                >
                    <Text
                        style={{ marginTop: 10, fontSize: 20, color: '#777', textAlign: 'center', width: 145 }}
                        ellipsizeMode='tail'
                        numberOfLines={1}
                    >Hi! {user ? user.displayName : 'Guest'}
                    </Text>
                </BgImage>
            </TouchableHighlight>
        </View>
    );
};

SideBarTopAvatar.propTypes = {
    navigation: PropTypes.object,
    user: PropTypes.object,
    group: PropTypes.object
};

export default memo(SideBarTopAvatar);
