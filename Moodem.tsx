/* eslint-disable max-len */
import { createStackNavigator } from '@react-navigation/stack';
import AbortController from 'abort-controller';
import React, { memo, useContext, useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import io from 'socket.io-client';
import BgImage from './components/common/functional-components/BgImage';
import { CommonStackWrapper } from './components/common/functional-components/CommonStackWrapper';
import PreLoader from './components/common/functional-components/PreLoader';
import SideBarDrawer from './components/common/functional-components/SideBarDrawer';
import { AppContext } from './components/User/store-context/AppContext';
import GuestScreen from './screens/Guest/functional-components/GuestScreen';
import { Avatars } from './screens/User/functional-components/Avatars';
import { loadFromLocalStorage, removeItem, saveOnLocalStorage } from './src/js/Utils/common/storageConfig';
import { getUserGroups } from './src/js/Utils/Helpers/actions/groups';
import firebase from './src/js/Utils/Helpers/services/firebase';
import { IP, socketConf } from './src/js/Utils/Helpers/services/socket';

const ONE_DAY = 1000 * 3600 * 24;
const NINTY_DAYS = ONE_DAY * 90;

const Stack = createStackNavigator();
const controller = new AbortController();

function getUserUidAndName(user: any) {
    let guid = Number(Math.random() * 36);
    const guestUID = Date.now().toString(36) + (guid++ % 36).toString(36) + Math.random().toString(36).slice(2, 4);

    if (user) {
        return `uid=${user.uid}&displayName=${user.displayName}`;
    }

    return `uid=${guestUID}&displayName=Guest`;
}
async function getGroupsAndSaveOnLocalStorage(user: any) {
    const userGroups = await getUserGroups(user) as any;
    await saveOnLocalStorage(user.uid, userGroups, NINTY_DAYS);

    return userGroups;
}
const App = function Moodem() {
    const { dispatchContextApp, user, isLoading }: any = useContext(AppContext);

    useEffect(() => {
        console.log('1. ON EFFECT Moodem');

        firebase.auth().onAuthStateChanged(async (_user: any) => {
            const socket = io(IP, { ...socketConf, query: getUserUidAndName(_user) } as any);

            if (_user) {
                try {
                    // await removeItem(_user.uid);
                    const groupsLocalStorage = await loadFromLocalStorage(_user.uid);
                    const groups = groupsLocalStorage instanceof Array ?
                    groupsLocalStorage :
                    await getGroupsAndSaveOnLocalStorage(_user);
                    const group = groups[0];

                    return dispatchContextApp({
                        type: 'user_groups',
                        value: {
                            user: _user,
                            groups,
                            group: Object.assign(group, {
                                group_songs: group.group_songs || []
                            }),
                            isLoading: false,
                            isServerError: false,
                            socket
                        }
                    });
                } catch (error) {
                    console.log('Something happened', error);
                    // send error to sentry
                    return dispatchContextApp({
                        type: 'error_user', value: {
                            error,
                            user: null,
                            isLoading: true,
                            isServerError: false,
                            socket
                        }
                    });
                }
            } else {
                return dispatchContextApp({
                    type: 'guest', value: {
                        user: null,
                        isLoading: false,
                        isServerError: false,
                        socket
                    }
                });
            }
        });

        return () => {
            console.log('2. OFF EFFECT Moodem');
            controller.abort();
        };
    }, []);

    if (isLoading) {
        return (
            <View>
                <BgImage />
                <PreLoader
                    containerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    size={50}
                />
            </View>
        );
    } else if (user) {
        return (
            <CommonStackWrapper>
                <Stack.Screen name='Drawer' component={SideBarDrawer} options={{ headerShown: false }} />
                <Stack.Screen name='Avatars' component={Avatars} options={Avatars.navigationOptions} />
            </CommonStackWrapper>
        );
    }

    return (
        <CommonStackWrapper>
            <Stack.Screen name='Guest' component={GuestScreen} />
            <Stack.Screen name='Drawer' component={SideBarDrawer} options={{ headerShown: false }} />
        </CommonStackWrapper>
    );
};

export default memo(App);
