import React, { memo, useContext } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { avatarContainer, avatarImage } from '../../../src/css/styles/avatar';
import { USER_AVATAR_DEFAULT } from '../../../src/js/Utils/constants/users';

type propsSideBarTopAvatar = {
    navigation: any
};

const SideBarTopAvatar = (props: propsSideBarTopAvatar) => {
    const { navigation } = props;
    const { user }: any = useContext(AppContext);

    return (
        <View style={avatarContainer}>
            <TouchableHighlight underlayColor='#eee' onPress={() => navigation.navigate('Profile')}>
                <FastImage
                    style={avatarImage}
                    source={{
                        uri: user.photoURL || USER_AVATAR_DEFAULT,
                        priority: FastImage.priority.high
                    }}
                />
            </TouchableHighlight>
            <Text
                style={{ marginTop: 10, fontSize: 20, color: '#777', textAlign: 'center', width: 145 }}
                ellipsizeMode='tail'
                numberOfLines={1}
            >
                {user.displayName}
            </Text>
        </View>
    );
};

export default memo(SideBarTopAvatar);
