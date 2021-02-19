/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { BgImage } from '../../../components/common/functional-components/BgImage';
import { PreLoader } from '../../../components/common/functional-components/PreLoader';

const Avatars = (props: any) => {
    const { route, navigation } = props;
    const [loading, setLoading] = useState(false);

    if (!route.params.avatarUrls.length || loading) {
        return (
            <PreLoader
                containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                size={50}
            />
        );
    }

    const changeAvatar = (url: string, user: any) => {
        setLoading(true);

        user.updateProfile({
            photoURL: url
        }).then(() => {
            setLoading(false);
            navigation.navigate('Profile', {
                params: url
            });
        }, () => { });
    };

    const handleUserAvatar = (url: string, user: any) => {
        Alert.alert(
            'Are you sure you want this avatar?',
            undefined,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'OK', onPress: () => changeAvatar(url, user) }
            ],
            { cancelable: false }
        );
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 5, justifyContent: 'center' }}>
                    {route.params.avatarUrls.map((avatar: any, key: number) => (
                        <TouchableOpacity key={key.toString()} onPress={() => handleUserAvatar(avatar.avatarUrl, route.params.user)}>
                            <BgImage
                                key={key.toString()}
                                source={{ uri: avatar.avatarUrl, cache: 'force-cache' }}
                                bgImageStyle={[{
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
};

Avatars.navigationOptions = () => ({
    unmountOnBlur: true,
    title: 'Avatars',
    headerBackTitle: ''
});

Avatars.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object
};

memo(Avatars);

export {
    Avatars
};
