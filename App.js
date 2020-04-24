/* eslint-disable max-len */
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text, TouchableHighlight, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from './src/js/Utils/Helpers/services/firebase';
import './src/js/Utils/Helpers/services/sentry';
import { OfflineNotice } from './components/common/OfflineNotice';
import { P2PLanding } from './components/User/P2PLanding';
import { Login } from './components/Guest/class-components/Login';
import { Register } from './components/Guest/class-components/Register';
import { GuestScreen } from './screens/Guest/class-components/GuestScreen';
import { PreLoader } from './components/common/functional-components/PreLoader';
import { Disclaimer } from './screens/common/functional-components/Disclaimer';
import { FAQ } from './screens/common/functional-components/FAQ';
import { About } from './screens/common/functional-components/About';
import { Copyright } from './screens/common/functional-components/Copyright';
import { GeneralChatRoom } from './screens/common/functional-components/GeneralChatRoom';
import { Avatar } from './components/common/class-components/Avatar';
import { Profile } from './components/User/class-components/Profile';
import { Settings } from './components/User/class-components/Settings';
import { avatarContainer } from './src/css/styles/Avatar';
import { Icon } from 'react-native-elements';


/* eslint-disable global-require */

const GuestStack = createStackNavigator();
const Drawer = createDrawerNavigator();

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

  CustomDrawerContent= (props, params) => (
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label={() => (<Icon
            name='exit-to-app'
            type='material-icons'
            color='#dd0031'
            size={25}
          />)}

          style={[{ width: 70, alignItems: 'flex-start', position: 'absolute', top: 45, left: -40, margin: 30 }, {
            transform: [{ rotate: '180deg' }]
          }]}
          onPress={() => firebase.auth().signOut().then(() => {
            this.setState({ user: null });
            props.navigation.navigate('Guest');
          })}
        />
        <DrawerItem
          label={() => <Avatar navigation={props.navigation} user={params.user} />} style={avatarContainer}
          onPress={() => (params.user ? props.navigation.navigate('Profile') : props.navigation.navigate('Guest'))}
        />
        {!params.user && <DrawerItem label="Back to Login" onPress={() => props.navigation.navigate('Guest')} />}
        <DrawerItemList {...props} />
        <DrawerItem
          label={() => <Copyright color={{ color: '#dd0031' }} />}
          onPress={() => console.log('Pressed Copyright', props)}
          style={Copyright.containerStyle}
        />
      </DrawerContentScrollView>
    )

  SideBarDrawer = ({ navigation, route }) => (
      <Drawer.Navigator initialRouteName="Moodem" drawerType="slide" drawerContent={(props) => this.CustomDrawerContent({ ...props }, { user: route.params.user })}>
        <Drawer.Screen name="Moodem" component={P2PLanding} options={P2PLanding.navigationOptions} />
        <Drawer.Screen name="Chat Room" component={GeneralChatRoom} />
        {route.params.user && <Drawer.Screen name="Profile" component={Profile} options={Profile.navigationOptions} />}
        {route.params.user && <Drawer.Screen name="Settings" component={Settings} options={Settings.navigationOptions} />}
        <Drawer.Screen name="Disclaimer" component={Disclaimer} />
        <Drawer.Screen name="FAQ" component={FAQ} />
        <Drawer.Screen name="About" component={About} />
      </Drawer.Navigator>
    )

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
    } else if (data && data.user) {
      this.setState({ user: data.user, isRegistered: true });
    }
  }

  handleCredentials = () => {
    console.log('Credentials');
  }

  render() {
    console.log('Called render(), from App Component');
    const {
      hasInternetConnection,
      isRegistered,
      isViewingLandPage,
      loading,
      user,
    } = this.state;

    console.log('User', user);

    // if (!hasInternetConnection) {
    //   return (<OfflineNotice />);
    // } else if (false) {
    //   return (
    //     <GuestScreen>
    //       <PreLoader size={50} />
    //     </GuestScreen>
    //   );
    // } else if (isRegistered) {
    //   //   const Drawer = createDrawerNavigator();

    //   //   // return (<NavigationContainer>
    //   //   //   <Drawer.Navigator initialRouteName="P2PLanding">
    //   //   //      {/* Avatar */}
    //   //   //      {/* Username */}
    //   //   //     {/* Create New Group Button */}
    //   //   //     <Drawer.Screen name="Chat Room" component={GeneralChatRoom} />
    //   //   //     <Drawer.Screen name="About" component={About} />
    //   //   //   </Drawer.Navigator>
    //   //   // </NavigationContainer>);
    //   // } else if (isViewingLandPage) {
    //   //   const Drawer = createDrawerNavigator();

    //   //   return (<NavigationContainer>
    //   //     <Drawer.Navigator initialRouteName="P2PLanding">
    //   //     {/* <Drawer.Screen name="Chat Room" component={GeneralChatRoom} /> */}
    //   //     <Drawer.Screen name="Test" component={goToButton} />
    //   //       <Drawer.Screen
    //   //         name="P2PLanding" component={P2PLanding}
    //   //       />
    //   //       {/* Login/Register buttons */}
    //   //       <Drawer.Screen name="About" component={About} />
    //   //     </Drawer.Navigator>
    //   //   </NavigationContainer>);
    // }

    return (
      <NavigationContainer initialRouteName="Guest">
        <GuestStack.Navigator>
          <GuestStack.Screen
            name="Guest" component={GuestScreen} options={GuestScreen.navigationOptions} initialParams={{ user }}
          />
          <GuestStack.Screen
            name="Drawer" component={this.SideBarDrawer} options={{ headerShown: false }} initialParams={{ user }}
          />
        </GuestStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
