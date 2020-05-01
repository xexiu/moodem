/* eslint-disable max-len */
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
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

console.disableYellowBox = true;

/* eslint-disable global-require */

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export class App extends Component {
  state = {
    hasInternetConnection: true,
    isViewingLandPage: false,
    loading: true,
    user: '',
    group: { group_name: 'Moodem' },
    connectionParams: {
      connectionType: 'wifi',
      connectionDetails: null
    }
  };


  componentDidMount() {
    // Sentry.nativeCrash();
    //throw new Error('My first app crash test for Sentry Logs');
    // For Testing NOT logged
    //firebase.auth().signOut();

    firebase.auth().onAuthStateChanged(this.handleUserAuthFirebase);
    this.netInfo();
  }

  componentWillUnmount() {
    this.netInfo = null;
  }

  handleGroup = (group) => {
    this.setState({
      group
    });
  }

  signOut = (navigation) => {
    firebase.auth().signOut().then(() => {
      this.setState({ user: '', group: { group_name: 'Moodem' } });
      navigation.navigate('Guest', {
        params: {
          user: ''
        }
      });
    });
  }

  goHome = (navigation) => {
    this.setState({ group: { group_name: 'Moodem' } });
    navigation.navigate('Moodem');
  }

  SideBarDrawer = ({ route }) => {
    if (this.state.user) {
      return (
        <CommonDrawerWrapper user={this.state.user} group={this.state.group} signOut={this.signOut} goHome={this.goHome} handleGroup={this.handleGroup}>
          <Drawer.Screen name="Profile" component={Profile} options={Profile.navigationOptions} initialParams={{ group: this.state.group }} />
          {/*
          // TODO: ROADMAP Settings screen?
          <Drawer.Screen name="Settings" component={Settings} options={Settings.navigationOptions} initialParams={{ user: route.params.user, group: this.state.group }} /> */

          }
        </CommonDrawerWrapper>
      );
    }
    return (
      <CommonDrawerWrapper user={this.state.user} group={this.state.group} signOut={this.signOut} goHome={this.goHome} handleGroup={this.handleGroup} />
    );
  }

  handleUserAuthFirebase = user => {
    if (user) {
      this.setState({ user, loading: false });
    } else {
      this.setState({ user: '', loading: false });
    }
  }

  netInfo = () => NetInfo.fetch().then(connection => {
    this.handleConnectivityChange(connection);
  });

  handleConnectivityChange = (connection) => {
    this.setState({
      hasInternetConnection: connection.isConnected,
      connectionParams: {
        connectionType: connection.type,
        connectionDetails: connection.details
      }
    });
  }

  loginHandlerGuest = (data) => {
    if (data.hasForgotPassword) {
      this.setState({ hasForgotPassword: data.hasForgotPassword });
    } else if (data && data.user) {
      this.setState({ user: data.user });
    }
  }

  render() {
    console.log('Called render(), from App Component');
    const {
      hasInternetConnection,
      loading = false,
      user
    } = this.state;

    if (!hasInternetConnection) {
      return (<OfflineNotice />);
    }

    if (loading) {
      return (
        <View>
          <BgImage />
          <PreLoader size={50} />
        </View>
      );
    }

    if (user) {
      return (
        <UserContext.Provider value={{ user: this.state.user, group: this.state.group }}>
          <CommonStackWrapper initialRouteName="Drawer">
            <Stack.Screen name="Drawer" component={this.SideBarDrawer} options={{ headerShown: false }} initialParams={{ user: this.state.user }} />
            <Stack.Screen name="Guest" component={GuestScreen} options={GuestScreen.navigationOptions} />
            <Stack.Screen name="Avatars" component={Avatars} options={Avatars.navigationOptions} />
          </CommonStackWrapper>
        </UserContext.Provider>
      );
    }

    return (
      <CommonStackWrapper initialRouteName="Guest">
        <Stack.Screen name="Guest" component={GuestScreen} options={GuestScreen.navigationOptions} />
        <Stack.Screen name="Drawer" component={this.SideBarDrawer} options={{ headerShown: false }} initialParams={{ user: this.state.user }} />
      </CommonStackWrapper>
    );
  }
}

export default App;
