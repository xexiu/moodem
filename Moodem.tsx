import { createStackNavigator } from '@react-navigation/stack';
import AbortController from 'abort-controller';
import React, { memo, useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import 'react-native-gesture-handler';
import io from 'socket.io-client';
import BgImage from './components/common/functional-components/BgImage';
import { CommonStackWrapper } from './components/common/functional-components/CommonStackWrapper';
import PreLoader from './components/common/functional-components/PreLoader';
import SideBarDrawer from './components/common/functional-components/SideBarDrawer';
import useAppState from './components/User/custom-hooks/useAppState';
import { AppContext } from './components/User/store-context/AppContext';
import { SongsContextProvider } from './components/User/store-context/SongsContext';
import GuestScreen from './screens/Guest/functional-components/GuestScreen';
import { Avatars } from './screens/User/functional-components/AvatarsScreen';
import { getUserGroups } from './src/js/Utils/Helpers/actions/groups';
import firebase from './src/js/Utils/Helpers/services/firebase';
import { IP, socketConf } from './src/js/Utils/Helpers/services/socket';

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
const App = function Moodem() {
    const { dispatchContextApp, user, isLoading }: any = useContext(AppContext);
    const { setSocket } = useAppState();
    const toastRef = useRef() as any;

    useEffect(() => {
        console.log('1. ON EFFECT Moodem');

        firebase.auth().onAuthStateChanged(async (_user: any) => {
            const socket = io(IP, { ...socketConf, query: getUserUidAndName(_user) } as any);

            if (_user) {
                try {
                    const groups = await getUserGroups(_user) as any;
                    const group = groups[0];
                    setSocket(socket);

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
                    console.error('Moodem Error', JSON.stringify(error));
                    toastRef.current.show('Oops!! Hubo un problema...', DURATION.FOREVER);
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
            controller.abort();
        };
    }, []);

    if (isLoading) {
        return (
            <View>
                <BgImage />
                <Toast
                    position={'bottom'}
                    ref={toastRef}
                />
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
            <SongsContextProvider>
                <CommonStackWrapper>
                    <Stack.Screen name='Drawer' component={SideBarDrawer} options={{ headerShown: false }} />
                    <Stack.Screen name='Avatars' component={Avatars} options={Avatars.navigationOptions} />
                </CommonStackWrapper>
            </SongsContextProvider>
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
