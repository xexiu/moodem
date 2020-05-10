/* eslint-disable max-len */
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AbortController from 'abort-controller';
import './src/js/Utils/Helpers/services/sentry';
import firebase from './src/js/Utils/Helpers/services/firebase';
import { OfflineNotice } from './components/common/OfflineNotice';
import { GuestScreen } from './screens/Guest/class-components/GuestScreen';
import { PreLoader } from './components/common/functional-components/PreLoader';
import { BgImage } from './components/common/functional-components/BgImage';
import { CommonStackWrapper } from './components/common/functional-components/CommonStackWrapper';
import { UserContext } from './components/User/functional-components/UserContext';
import { Avatars } from './screens/User/functional-components/Avatars';
import { SideBarDrawer } from './components/common/functional-components/SideBarDrawer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

console.disableYellowBox = true;

const Stack = createStackNavigator();
const controller = new AbortController();

const handleConnectivityChange = (connection, setInternetConnection) => {
  setInternetConnection({
    hasInternetConnection: connection.isConnected,
    connectionParams: {
      connectionType: connection.type,
      connectionDetails: connection.details
    }
  });
};

const handleUserAuthFirebase = (user, setUser) => {
  if (user) {
    setUser({ user, loading: false });
  } else {
    setUser({ user: '', loading: false });
  }
};

export default function Moodem() {
  const [{ hasInternetConnection, connectionParams }, setInternetConnection] = useState(true);
  const [{ user, loading = true, group = { group_name: 'Moodem' } }, setUser] = useState({ user: '' });

  useEffect(() => {
    NetInfo.fetch().then(connection => handleConnectivityChange(connection, setInternetConnection))
      .then(() => firebase.auth().onAuthStateChanged(_user => handleUserAuthFirebase(_user, setUser)));

    return () => {
      controller.abort();
    };
  }, [hasInternetConnection, user.uid, group.group_name]);

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
            }} size={50}
          />
        </View>
      </ErrorBoundary>
    );
  } else if (user) {
    return (
      <ErrorBoundary>
        <UserContext.Provider value={{ user, group }}>
          <CommonStackWrapper initialRouteName="Drawer">
            <Stack.Screen name="Drawer" component={SideBarDrawer} options={{ headerShown: false }} />
            <Stack.Screen name="Avatars" component={Avatars} options={Avatars.navigationOptions} />
            <Stack.Screen name="Guest" component={GuestScreen} options={GuestScreen.navigationOptions} />
          </CommonStackWrapper>
        </UserContext.Provider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <UserContext.Provider value={{ user, group }}>
        <CommonStackWrapper initialRouteName="Guest">
          <Stack.Screen name="Guest" component={GuestScreen} options={GuestScreen.navigationOptions} />
          <Stack.Screen name="Drawer" component={SideBarDrawer} options={{ headerShown: false }} />
        </CommonStackWrapper>
      </UserContext.Provider>
    </ErrorBoundary>
  );
}
