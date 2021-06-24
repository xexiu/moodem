/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { loadFromLocalStorage, saveOnLocalStorage } from '../../../src/js/Utils/common/storageConfig';
import { getAllRandomUserAvatars } from '../../../src/js/Utils/Helpers/actions/users';

const controller = new AbortController();

const DEFAULT_AVATAR_STYLE = {
    width: 90,
    height: 90,
    borderRadius: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10
};

const Avatars = (props: any) => {
    const { navigation } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [avatarUrls, setUrls] = useState([]);
    const { user, dispatchContextApp } = useContext(AppContext) as any;

    async function getAllRandomAvatars() {
        try {
            const avatarsUrlsFromStorage = await loadFromLocalStorage('randomUserAvatars');
            if (avatarsUrlsFromStorage) {
                setIsLoading(false);
                return setUrls(avatarsUrlsFromStorage);
            }
            const urls = await getAllRandomUserAvatars();
            await saveOnLocalStorage('randomUserAvatars', urls, null);
            setUrls(urls);
            setIsLoading(false);
        } catch (error) {
            console.error('getAllRandomAvatars Error', JSON.stringify(error));
        }
    }

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true
        });
        getAllRandomAvatars();
        return () => {
            controller.abort();
        };
    }, [avatarUrls]);

    async function changeAvatar(url: string) {
        setIsLoading(true);
        await user.updateProfile({
            photoURL: url
        });
        setIsLoading(false);
        await dispatchContextApp({
            type: 'set_user',
            value: {
                user
            }
        });
        await navigation.navigate('Profile');
    }

    const handleUserAvatar = (url: string) => {
        Alert.alert(
            '¿Estás segur@ de cambiar a este avatar?',
            undefined,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'OK', onPress: () => changeAvatar(url) }
            ],
            { cancelable: false }
        );
    };

    if (isLoading) {
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

    return (
        <BodyContainer>
            <ScrollView>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 5, justifyContent: 'center' }}>
                    {avatarUrls.map((avatarUrl: any, key: number) => (
                        <TouchableOpacity
                            key={key.toString()}
                            onPress={() => handleUserAvatar(avatarUrl)}
                        >
                            <FastImage
                                style={DEFAULT_AVATAR_STYLE}
                                source={{
                                    uri: avatarUrl,
                                    priority: FastImage.priority.high
                                }}
                            />
                        </TouchableOpacity>))}
                </View>
            </ScrollView>
        </BodyContainer>
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
