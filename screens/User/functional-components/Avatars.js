/* eslint-disable max-len */
import React, { useState, memo } from 'react';
import { View, Alert, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { PreLoader } from '../../../components/common/functional-components/PreLoader';
import { BgImage } from '../../../components/common/functional-components/BgImage';

const changeAvatar = (url, navigation, setLoading, user) => {
    setLoading(true);

    user.updateProfile({
        photoURL: url
    }).then(() => {
        setLoading(false);
        navigation.navigate('Profile', {
            params: url
        });
    }, (err) => { });
};
const handleUserAvatar = (url, navigation, setLoading, user) => {
    Alert.alert(
        'Are you sure you want this avatar?',
        null,
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            },
            { text: 'OK', onPress: () => changeAvatar(url, navigation, setLoading, user) }
        ],
        { cancelable: false }
    );
};
const Avatars = memo((props) => {
    const { route, navigation } = props;
    const [loading, setLoading] = useState(false);

    if (!route.params.avatarUrls.length || loading) {
        return (
            <PreLoader
                containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }} size={50}
            />
        );
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 5, justifyContent: 'center' }}>
                    {route.params.avatarUrls.map((avatar, key) => (
                        <TouchableOpacity key={key.toString()} onPress={() => handleUserAvatar(avatar.avatarUrl, navigation, setLoading, route.params.user)}>
                            <BgImage
                                key={key.toString()}
                                source={{ uri: avatar.avatarUrl }} bgImageStyle={[{
                                    width: 90,
                                    height: 90,
                                    borderColor: '#aaa',
                                    margin: 5
                                }, {}, { position: 'relative' }]}
                            />
                        </TouchableOpacity>))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
});

Avatars.navigationOptions = () => ({
    unmountOnBlur: true,
    title: 'Avatars',
    headerBackTitle: ''
});

export {
    Avatars
};
