/* eslint-disable max-len */
import { createStackNavigator } from '@react-navigation/stack';
import AbortController from 'abort-controller';
import React, { memo, useContext, useEffect } from 'react';
import 'react-native-gesture-handler';
import { CommonStackWrapper } from './components/common/functional-components/CommonStackWrapper';
import { SideBarDrawer } from './components/common/functional-components/SideBarDrawer';
import { AppContext } from './components/User/functional-components/AppContext';
import { GuestScreen } from './screens/Guest/functional-components/GuestScreen';
import { Avatars } from './screens/User/functional-components/Avatars';
import firebase from './src/js/Utils/Helpers/services/firebase';

const Stack = createStackNavigator();
const controller = new AbortController();

const App = function Moodem() {
    const { setContext, user }: any = useContext(AppContext);

    useEffect(() => {
        console.log('1. ON EFFECT Moodem');

        firebase.auth().onAuthStateChanged((_user: any) => setContext({ user: _user }));

        return () => {
            console.log('2. OFF EFFECT Moodem');
            controller.abort();
        };
    }, [setContext]);

    if (user) {
        return (
          <CommonStackWrapper>
            <Stack.Screen name='Drawer' component={SideBarDrawer} options={{ headerShown: false }} />
            <Stack.Screen name='Avatars' component={Avatars} options={Avatars.navigationOptions} />
            <Stack.Screen name='Guest' component={GuestScreen} options={GuestScreen.navigationOptions} />
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
