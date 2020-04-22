/* eslint-disable max-len */
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import firebase from './src/js/Utils/Helpers/services/firebase';
import './src/js/Utils/Helpers/services/sentry';
import { OfflineNotice } from './components/common/OfflineNotice';
import { P2PLanding } from './components/User/P2PLanding';
import { Login } from './components/common/class-components/Login';
import { Register } from './components/common/class-components/Register';
import { GuestScreen } from './screens/Guest/functional-components/GuestScreen';
import { View, Text, TouchableHighlight } from 'react-native';
import { PreLoader } from './components/common/functional-components/PreLoader';


/* eslint-disable global-require */

export class App extends Component {
  state = {
    hasInternetConnection: true,
    isRegistered: false,
    isViewingLandPage: false,
    loading: true,
    user: null,
    connectionParams: {
      connectionType: 'wifi',
      connectionDetails: null
    }
  };


  componentDidMount() {
    // Sentry.nativeCrash();
    //throw new Error('My first app crash test for Sentry Logs');
    // For Testing NOT logged
    firebase.auth().signOut();

    firebase.auth().onAuthStateChanged(this.handleUserAuthFirebase);
    this.netInfo();
  }

  componentWillUnmount() {
    this.netInfo = null;
  }

  handleUserAuthFirebase = user => {
    if (user) {
      this.setState({
        user,
        isRegistered: true,
        loading: false
      });
    } else {
      this.setState({
        isRegistered: false,
        loading: false
      });
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
    } else {
      console.log('Handler guest', data);
    }
    //this.setState({ isLoading: true });
  }

  render() {
    console.log('Called render(), from App Component');
    const {
      hasInternetConnection,
      isRegistered,
      isViewingLandPage,
      loading,
    } = this.state;

    if (!hasInternetConnection) {
      return (<OfflineNotice />);
    } else if (loading) {
      return (
        <GuestScreen>
          <PreLoader size={50} />
        </GuestScreen>
      );
    } else if (isRegistered || isViewingLandPage) {
      const Drawer = createDrawerNavigator();

      return (
        <View><Text>Sidebar</Text></View>
      );

      // return (<NavigationContainer>
      //   <Drawer.Navigator initialRouteName="P2PLanding">
      //     {/* Create New Group Button */}
      //     <Drawer.Screen name="Chat Room" component={GeneralChatRoom} />
      //     <Drawer.Screen name="About" component={About} />
      //   </Drawer.Navigator>
      // </NavigationContainer>);
    }

    return (
      <GuestScreen>
        <Login btnTitle="Login to Moodem" loginHandlerGuest={this.loginHandlerGuest} />
        <Register btnTitle="Become a Mooder" btnStyle={{ backgroundColor: '#00b7e0' }} />
        <TouchableHighlight onPress={() => this.setState({ isViewingLandPage: true })}>
          <Text style={{ color: '#00b7e0', fontSize: 16, marginTop: 20 }}>I want to see what's inside first!</Text>
        </TouchableHighlight>
      </GuestScreen>
    );
  }
}

export default App;
