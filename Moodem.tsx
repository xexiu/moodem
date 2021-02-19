/* eslint-disable max-len */
import NetInfo from '@react-native-community/netinfo';
import { createStackNavigator } from '@react-navigation/stack';
import AbortController from 'abort-controller';
import React, { useEffect, useState } from 'react';
import { LogBox, View } from 'react-native';
import 'react-native-gesture-handler';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { BgImage } from './components/common/functional-components/BgImage';
import { CommonStackWrapper } from './components/common/functional-components/CommonStackWrapper';
import { PreLoader } from './components/common/functional-components/PreLoader';
import { SideBarDrawer } from './components/common/functional-components/SideBarDrawer';
import { OfflineNotice } from './components/common/OfflineNotice';
import { UserContext } from './components/User/functional-components/UserContext';
import { GuestScreen } from './screens/Guest/functional-components/GuestScreen';
import { Avatars } from './screens/User/functional-components/Avatars';
import firebase from './src/js/Utils/Helpers/services/firebase';

LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Constants.manifest is null because the embedded app.config could not be read.'
]);

const Stack = createStackNavigator();
const controller = new AbortController();

const handleConnectivityChange = (connection: any, setInternetConnection: Function) => {
    setInternetConnection({
        hasInternetConnection: connection.isConnected,
        connectionParams: {
            connectionType: connection.type,
            connectionDetails: connection.details
        }
    });
};

const handleUserAuthFirebase = (user: object, setUser: Function) => {
    if (user) {
        setUser({ user, loading: false });
    } else {
        setUser({ user: '', loading: false });
    }
};

export default function Moodem() {
    const [{ hasInternetConnection }, setInternetConnection] = useState({ hasInternetConnection: true });
    const [{ user, loading }, setUser] = useState({ user: '', loading: true });
    const [{ group = { group_name: 'Moodem' } }] = useState({ group: { group_name: 'Moodem' } });

    useEffect(() => {
        console.log('1. Landing Moodem');
        NetInfo.fetch().then(connection => handleConnectivityChange(connection, setInternetConnection))
      .then(() => firebase.auth().onAuthStateChanged((_user: object) => handleUserAuthFirebase(_user, setUser)));

        return () => {
            console.log('4. OFF EFFECT Moodem');
            controller.abort();
        };
    }, []);

    if (!hasInternetConnection) {
        return (<OfflineNotice />);
    }

    if (loading) {
        return (
      <ErrorBoundary>
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
      </ErrorBoundary>
        );
    } else if (user) {
        console.log('USEER', user);
        return (
      <ErrorBoundary>
        <UserContext.Provider value={{ user, group }}>
          <CommonStackWrapper initialRouteName='Drawer'>
            <Stack.Screen name='Drawer' component={SideBarDrawer} options={{ headerShown: false }} />
            <Stack.Screen name='Avatars' component={Avatars} options={Avatars.navigationOptions} />
          </CommonStackWrapper>
        </UserContext.Provider>
      </ErrorBoundary>
        );
    }

    return (
    <ErrorBoundary>
      <UserContext.Provider value={{ user, group }}>
        <CommonStackWrapper initialRouteName='Guest'>
          <Stack.Screen name='Guest' component={GuestScreen} options={GuestScreen.navigationOptions} />
          <Stack.Screen name='Drawer' component={SideBarDrawer} options={{ headerShown: false }} />
        </CommonStackWrapper>
      </UserContext.Provider>
    </ErrorBoundary>
    );
}
