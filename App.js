/* eslint-disable max-len */
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import './src/js/Utils/Helpers/services/sentry';
import firebase from './src/js/Utils/Helpers/services/firebase';
import { OfflineNotice } from './components/common/OfflineNotice';
import { GuestScreen } from './screens/Guest/class-components/GuestScreen';
import { PreLoader } from './components/common/functional-components/PreLoader';
import { Profile } from './components/User/class-components/Profile';
import { Settings } from './components/User/class-components/Settings';
import { BgImage } from './components/common/functional-components/BgImage';
import { CommonDrawerWrapper } from './components/common/functional-components/CommonDrawerWrapper';
import { CommonStackWrapper } from './components/common/functional-components/CommonStackWrapper';

console.disableYellowBox = true;

/* eslint-disable global-require */

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export class App extends Component {
  state = {
    hasInternetConnection: true,
    isViewingLandPage: false,
    loading: true,
    user: null,
    groupName: 'Moodem',
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

  handleGroupName = (groupName) => {
    this.setState({
      groupName
    });
  }

  signOut = (navigation) => {
    firebase.auth().signOut().then(() => {
      this.setState({ user: null, groupName: 'Moodem' });
      CommonActions.reset({
        index: 0,
        key: null,
        routes: [
          {
            name: 'Guest',
            params: { user: null }
          }
        ]
      });
      navigation.navigate('Guest');
    });
  }

  goHome = (navigation) => {
    this.setState({ groupName: 'Moodem' });
    navigation.navigate('Moodem');
  }

  SideBarDrawer = ({ route }) => {
    if (this.state.user) {
      return (
        <CommonDrawerWrapper user={route.params.user} groupName={this.state.groupName} signOut={this.signOut} goHome={this.goHome} handleGroupName={this.handleGroupName}>
          <Drawer.Screen name="Profile" component={Profile} options={Profile.navigationOptions} initialParams={{ user: route.params.user, groupName: this.state.groupName }} />
          <Drawer.Screen name="Settings" component={Settings} options={Settings.navigationOptions} initialParams={{ user: route.params.user, groupName: this.state.groupName }} />
        </CommonDrawerWrapper>
      );
    }
    return (
      <CommonDrawerWrapper user={route.params.user} groupName={this.state.groupName} signOut={this.signOut} goHome={this.goHome} handleGroupName={this.handleGroupName} />
    );
  }

  handleUserAuthFirebase = user => {
    if (user) {
      this.setState({ user, loading: false });
    } else {
      this.setState({ user: null, loading: false });
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

  handleCredentials = () => {
    console.log('Credentials');
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
          <BgImage source={require('./assets/images/logo_moodem.png')} />
          <PreLoader containerStyle={{ justifyContent: 'center', alignItems: 'center' }} size={50} />
        </View>
      );
    }

    if (user) {
      return (
        <CommonStackWrapper initialRouteName="Drawer">
          <Stack.Screen name="Drawer" component={this.SideBarDrawer} options={{ headerShown: false }} initialParams={{ user }} />
          <Stack.Screen name="Guest" component={GuestScreen} options={GuestScreen.navigationOptions} />
        </CommonStackWrapper>
      );
    }

    return (
      <CommonStackWrapper initialRouteName="Guest">
        <Stack.Screen name="Guest" component={GuestScreen} options={GuestScreen.navigationOptions} />
        <Stack.Screen name="Drawer" component={this.SideBarDrawer} options={{ headerShown: false }} initialParams={{ user }} />
      </CommonStackWrapper>
    );
  }
}

export default App;
