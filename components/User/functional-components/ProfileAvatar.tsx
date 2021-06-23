/* eslint-disable max-len */
import { useNavigation } from '@react-navigation/native';
import React, { memo, useContext } from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { avatarContainer, avatarImage } from '../../../src/css/styles/avatar';
import { btnShadow } from '../../../src/css/styles/common';
import { USER_AVATAR_DEFAULT } from '../../../src/js/Utils/constants/users';
import BgImage from '../../common/functional-components/BgImage';
import { AppContext } from '../store-context/AppContext';

const ProfileAvatar = () => {
    const { user } = useContext(AppContext) as any;
    const navigation = useNavigation();

    return (
        <View style={[avatarContainer, { marginTop: 5, position: 'relative' }]}>
            <BgImage
                source={{ uri: user.photoURL || USER_AVATAR_DEFAULT, cache: 'force-cache' }}
                bgImageStyle={[avatarImage, btnShadow, { position: 'relative' }]}
            >
                <View style={{ position: 'absolute', right: -10, bottom: 20 }}>
                    <Icon
                        raised
                        iconStyle={{ paddingTop: 5 }}
                        Component={TouchableScale}
                        name={'pencil'}
                        type={'entypo'}
                        color='#dd0031'
                        size={15}
                        onPress={() => navigation.navigate('Avatars')}
                    />
                </View>
                <Text
                    style={{ marginTop: 10, fontSize: 15, color: '#777', textAlign: 'center', width: 145 }}
                    ellipsizeMode='tail'
                    numberOfLines={1}
                >
                    Hola {user.displayName}!
                </Text>
            </BgImage>
        </View>
    );
};

export default memo(ProfileAvatar);
