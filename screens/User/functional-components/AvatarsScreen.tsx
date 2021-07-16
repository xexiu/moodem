import React, { memo, useContext, useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { loadFromLocalStorage, saveOnLocalStorage } from '../../../src/js/Utils/common/storageConfig';
import { NavigationOptions } from '../../../src/js/Utils/Helpers/actions/navigation';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
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
            await saveOnLocalStorage('randomUserAvatars', urls);
            setUrls(urls);
            setIsLoading(false);
        } catch (error) {
            console.error('getAllRandomAvatars Error', error);
        }
    }

    useEffect(() => {
        navigation.setOptions({
            ...NavigationOptions(navigation),
            title: 'Avatars'
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
            `${translate('profile.alertAvatars')}`,
            undefined,
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
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
        <BodyContainer useScrollView={true}>
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
        </BodyContainer>
    );
};

memo(Avatars);

export {
    Avatars
};
