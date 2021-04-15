/* eslint-disable max-len */
import { createStackNavigator } from '@react-navigation/stack';
import AbortController from 'abort-controller';
import React, { memo, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import BgImage from './components/common/functional-components/BgImage';
import { CommonStackWrapper } from './components/common/functional-components/CommonStackWrapper';
import PreLoader from './components/common/functional-components/PreLoader';
import { SideBarDrawer } from './components/common/functional-components/SideBarDrawer';
import { AppContext } from './components/User/store-context/AppContext';
import GuestScreen from './screens/Guest/functional-components/GuestScreen';
import { Avatars } from './screens/User/functional-components/Avatars';
import { getGroups } from './src/js/Utils/Helpers/actions/groups';
import firebase from './src/js/Utils/Helpers/services/firebase';

const Stack = createStackNavigator();
const controller = new AbortController();

const App = function Moodem() {
    const { dispatch, user }: any = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const [progressLoading, setProgressLoading] = useState(0.1);

    useEffect(() => {
        console.log('1. ON EFFECT Moodem');

        setProgressLoading(0.3);

        firebase.auth().onAuthStateChanged((_user: any) => {
            if (_user) {
                setProgressLoading(0.7);
                getGroups(_user)
                    .then((dbGroups) => {
                        dispatch({ type: 'groups', value: dbGroups as string[] });
                        setProgressLoading(1);
                        setIsLoading(false);
                    })
                    .catch(err => console.log('Something happened', err));
                dispatch({ type: 'user', value: _user });
            } else {
                setIsLoading(false);
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
                    progress={progressLoading}
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
