/* eslint-disable max-len */
import { createStackNavigator } from '@react-navigation/stack';
import AbortController from 'abort-controller';
import React, { memo, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import { BgImage } from './components/common/functional-components/BgImage';
import { CommonStackWrapper } from './components/common/functional-components/CommonStackWrapper';
import { PreLoader } from './components/common/functional-components/PreLoader';
import { SideBarDrawer } from './components/common/functional-components/SideBarDrawer';
import { AppContext } from './components/User/functional-components/AppContext';
import { GuestScreen } from './screens/Guest/functional-components/GuestScreen';
import { Avatars } from './screens/User/functional-components/Avatars';
import firebase from './src/js/Utils/Helpers/services/firebase';

const Stack = createStackNavigator();
const controller = new AbortController();

const App = function Moodem() {
    const { dispatch, user }: any = useContext(AppContext);
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        console.log('1. ON EFFECT Moodem');

        firebase.auth().onAuthStateChanged((_user: any) => {
            dispatch({ type: 'user', value: _user });
            setIsloading(false);
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
            <Stack.Screen name='Guest' component={GuestScreen} options={GuestScreen.navigationOptions} />
            <Stack.Screen name='Drawer' component={SideBarDrawer} options={{ headerShown: false }} />
        </CommonStackWrapper>
    );
};

memo(App);

export default App;
