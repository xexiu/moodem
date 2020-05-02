/* eslint-disable max-len */
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AbortController from 'abort-controller';
import './src/js/Utils/Helpers/services/sentry';
import firebase from './src/js/Utils/Helpers/services/firebase';
import { OfflineNotice } from './components/common/OfflineNotice';
import { GuestScreen } from './screens/Guest/class-components/GuestScreen';
import { PreLoader } from './components/common/functional-components/PreLoader';
import { Profile } from './components/User/functional-components/Profile';
import { Settings } from './components/User/class-components/Settings';
import { BgImage } from './components/common/functional-components/BgImage';
import { CommonDrawerWrapper } from './components/common/functional-components/CommonDrawerWrapper';
import { CommonStackWrapper } from './components/common/functional-components/CommonStackWrapper';
import { UserContext } from './components/User/functional-components/UserContext';
import { Avatars } from './screens/User/functional-components/Avatars';
import { SideBarDrawer } from './components/common/functional-components/SideBarDrawer';

console.disableYellowBox = true;

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
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
    setUser({ user });
  } else {
    setUser({ user: '' });
  }
};

export default function Moodem() {
  const [{ hasInternetConnection, connectionParams }, setInternetConnection] = useState(true);
  const [{ user, group = { group_name: 'Moodem' } }, setUser] = useState({ user: '' });

  useEffect(() => {
    NetInfo.fetch().then(connection => handleConnectivityChange(connection, setInternetConnection))
      .then(() => firebase.auth().onAuthStateChanged(_user => handleUserAuthFirebase(_user, setUser)));

    return () => {
      controller.abort();
    };
  }, [hasInternetConnection, user.uid, group.group_name]);

  if (!hasInternetConnection) {
    return (<OfflineNotice />);
  } else if (!user) {
    return (
      <View>
        <BgImage />
        <PreLoader
          containerStyle={{
            justifyContent: 'center',
            alignItems: 'center'
          }} size={50}
        />
      </View>
    );
  } else if (user) {
    return (
      <UserContext.Provider value={{ user, group }}>
        <CommonStackWrapper initialRouteName="Drawer">
          <Stack.Screen name="Drawer" component={SideBarDrawer} options={{ headerShown: false }} />
          <Stack.Screen name="Guest" component={GuestScreen} options={GuestScreen.navigationOptions} />
          <Stack.Screen name="Avatars" component={Avatars} options={Avatars.navigationOptions} />
        </CommonStackWrapper>
      </UserContext.Provider>
    );
  }

  return (
    <View>
      <Text>Testing...</Text>
    </View>
  );
}

// export class App extends Component {
//   state = {
//     hasInternetConnection: true,
//     loading: true,
//     user: '',
//     group: { group_name: 'Moodem' },
//     connectionParams: {
//       connectionType: 'wifi',
//       connectionDetails: null
//     }
//   };


//   componentDidMount() {
//     // For Testing NOT logged
//     //firebase.auth().signOut();

//     NetInfo.fetch().then(connection => this.handleConnectivityChange(connection))
//       .then(() => firebase.auth().onAuthStateChanged(this.handleUserAuthFirebase));
//   }

//   componentWillUnmount() {
//     this.controller.abort();
//   }

//   controller = new AbortController();

//   handleGroup = (group) => {
//     this.setState({
//       group
//     });
//   }

//   SideBarDrawer = () => {
//     if (this.state.user) {
//       return (
//         <CommonDrawerWrapper user={this.state.user} group={this.state.group} handleGroup={this.handleGroup}>
//           <Drawer.Screen name="Profile" component={Profile} options={Profile.navigationOptions} initialParams={{ group: this.state.group }} />
//           {/*
//           // TODO: ROADMAP Settings screen?
//           <Drawer.Screen name="Settings" component={Settings} options={Settings.navigationOptions} initialParams={{ user: route.params.user, group: this.state.group }} /> */

//           }
//         </CommonDrawerWrapper>
//       );
//     }
//     return (
//       <CommonDrawerWrapper user={this.state.user} group={this.state.group} goHome={this.goHome} handleGroup={this.handleGroup} />
//     );
//   }

//   handleUserAuthFirebase = user => {
//     if (user) {
//       this.setState({ user, loading: false });
//     } else {
//       this.setState({ user: '', loading: false });
//     }
//   }

//   handleConnectivityChange = (connection) => {
//     this.setState({
//       hasInternetConnection: connection.isConnected,
//       connectionParams: {
//         connectionType: connection.type,
//         connectionDetails: connection.details
//       }
//     });
//   }

//   loginHandlerGuest = (data) => {
//     if (data.hasForgotPassword) {
//       this.setState({ hasForgotPassword: data.hasForgotPassword });
//     } else if (data && data.user) {
//       this.setState({ user: data.user });
//     }
//   }

//   render() {
//     console.log('Called render(), from App Component', this.state.connectionParams);
//     const {
//       hasInternetConnection,
//       loading = false,
//       user
//     } = this.state;

//     if (!hasInternetConnection) {
//       return (<OfflineNotice />);
//     }

//     if (loading) {
//       return (
//         <View>
//           <BgImage />
//           <PreLoader
//             containerStyle={{
//               justifyContent: 'center',
//               alignItems: 'center'
//             }} size={50}
//           />
//         </View>
//       );
//     }

//     if (user) {
//       return (
//         <UserContext.Provider value={{ user: this.state.user, group: this.state.group }}>
//           <CommonStackWrapper initialRouteName="Drawer">
//             <Stack.Screen name="Drawer" component={this.SideBarDrawer} options={{ headerShown: false }} />
//             <Stack.Screen name="Guest" component={GuestScreen} options={GuestScreen.navigationOptions} />
//             <Stack.Screen name="Avatars" component={Avatars} options={Avatars.navigationOptions} />
//           </CommonStackWrapper>
//         </UserContext.Provider>
//       );
//     }

//     return (
//       <CommonStackWrapper initialRouteName="Guest">
//         <Stack.Screen name="Guest" component={GuestScreen} options={GuestScreen.navigationOptions} />
//         <Stack.Screen name="Drawer" component={this.SideBarDrawer} options={{ headerShown: false }} />
//       </CommonStackWrapper>
//     );
//   }
// }

// export default App;
