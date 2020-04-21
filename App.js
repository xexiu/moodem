import 'react-native-gesture-handler';
import React, { Component } from 'react';
import * as Sentry from '@sentry/react-native';
import NetInfo from '@react-native-community/netinfo';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OfflineNotice } from './components/common/OfflineNotice';
import { View, Button, Text, Icon } from 'react-native';
//import { Icon } from 'react-native-elements';
import { P2PLanding } from './components/User/P2PLanding';
import { BgImage } from './components/common/BgImage';
import { Login } from './screens/guest/Login';
import { CustomButton } from './components/common/CustomButton';
import t from 'tcomb-form-native';
import { formValidation } from './src/js/Utils/Helpers/validation';
import { login } from './src/js/Utils/Helpers/actions/loginActions';
import firebase from './src/js/Utils/Helpers/firebase';
import Toast from 'react-native-easy-toast';
import { CustomModal } from './components/common/functional-components/CustomModal';
//import { Register } from './screens/guest/Register';

//firebase.initializeApp(firebaseConfig);

const Form = t.form.Form;

Sentry.init({
  dsn: 'https://31ed020c1e8c41d0a2ca9739ecd11edb@o265570.ingest.sentry.io/5206914',
});


/* eslint-disable global-require */
function LoginHandler({ navigation }) {
  console.log('Navigatioon', navigation);
  return (
    <CustomButton
      btnTitle="Login to Moodem"
      btnStyle={{ backgroundColor: '#90c520', borderWidth: 0, width: 200, marginLeft: 'auto', marginRight: 'auto' }}
      btnOnPress={this.toggleModalLogin}
    />
  );
}

function Register({ navigation }) {
  console.log('Navigatioon', navigation);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>HEYYYY Register</Text>
      <Button
        onPress={() => console.log('Pressed', navigation.navigate('Login'))}
        title="Go to Register"
      />
    </View>
  );
}

export class App extends Component {
  state = {
    isLoginModalVisible: false,
    isRegisterModalVisible: false,
    hasInternetConnection: true,
    isRegistered: false,
    isViewingLandingPage: false,
    connectionParams: {
      connectionType: 'wifi',
      connectionDetails: null
    }
  };

  refForm = React.createRef();
  refToast = React.createRef();
  user = t.struct({
    email: formValidation.email,
    password: formValidation.password
  });
  options = {
    fields: {
      email: {
        help: 'Enter your email',
        error: 'Incorrect email or bad format!',
        autoCapitalize: 'none'
      },
      password: {
        help: 'Enter your password',
        error: 'Bad password or not allowed!',
        password: true,
        secureTextEntry: true
      }
    }
  };

  handleUserAuthFirebase = user => {
    if (user) {
      this.setState({
        user,
        isLogged: true,
        loaded: true
      });

      this.refToast.current.show('Successfully Authenticated!', 1000);
    } else {
      console.log('No user found with those credentials! Forgot password or username?');
      this.setState({
        isLogged: false,
        loaded: true
      });
    }
  }

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

  toggleModalLogin = () => {
    this.setState({ isLoginModalVisible: !this.state.isLoginModalVisible });
  };

  toggleModalRegister = () => {
    this.setState({ isRegisterModalVisible: !this.state.isRegisterModalVisible });
  };

  handleIsViewingLandingPage = () => {

  }

  render() {
    console.log('Called render(), from App Component');
    const {
      hasInternetConnection,
      isRegistered,
      isViewingLandingPage,
      isRegisterModalVisible,
      isLoginModalVisible
    } = this.state;

    if (!hasInternetConnection) {
      return (<OfflineNotice />);
    }
    // if no registered, then
    // Guest screen : 1. Login Button 2. Register Button

    // if (!isRegistered) {
    //   return (
    //     <View style={{ flex: 1, justifyContent: 'center' }}>
    //       <Toast ref={this.refToast} />
    //       <BgImage source={require('./assets/images/logo_moodem.png')} />
    //       <View>
    //         <CustomButton
    //           btnTitle="Login to Moodem"
    //           btnStyle={{ backgroundColor: '#90c520', borderWidth: 0, width: 200, marginLeft: 'auto', marginRight: 'auto' }}
    //           btnOnPress={this.toggleModalLogin}
    //         />
    //         <CustomButton
    //           btnTitle="Become a Mooder"
    //           btnStyle={{ backgroundColor: '#00b7e0', borderWidth: 0, width: 200, marginLeft: 'auto', marginRight: 'auto', marginTop: 10 }}
    //           btnOnPress={this.toggleModalRegister}
    //         />
    //       </View>

    //       <CustomModal isModalVisible={isLoginModalVisible} onBackdropPress={() => this.setState({ isLoginModalVisible: false })}>
    //         <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#777', textAlign: 'center', margin: 10 }}>You have the keys!!</Text>
    //         <Form
    //           ref={this.refForm} // this.refs.form would be the reference
    //           type={this.user}
    //           options={this.options}
    //         />
    //         <CustomButton
    //           btnTitle="Login"
    //           btnStyle={{ backgroundColor: '#90c520', borderWidth: 0, width: 200, marginLeft: 'auto', marginRight: 'auto', marginTop: 20 }}
    //           btnOnPress={login.bind(this)}
    //         />
    //       </CustomModal>

    //       <CustomModal isModalVisible={isRegisterModalVisible} onBackdropPress={() => this.setState({ isRegisterModalVisible: false })}>
    //         <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#777', textAlign: 'center' }}>Knock Knock!!</Text>
    //       </CustomModal>

    //     </View>
    //   );
    // }

    const AuthStack = createStackNavigator();

    return (
      <NavigationContainer>
        {/* <BgImage source={require('./assets/images/logo_moodem.png')} /> */}
        <AuthStack.Navigator>
          <AuthStack.Screen
            name="Login"
            component={LoginHandler}
            options={{ headerShown: false, title: '' }}
          />
          <AuthStack.Screen
            name="Register"
            component={Register}
          />
        </AuthStack.Navigator>
      </NavigationContainer>
    );

    const Drawer = createDrawerNavigator();

    // if (isRegistered) {
    //   return (<NavigationContainer>
    //     <Drawer.Navigator initialRouteName="P2PLanding">
    //       {/* Create New Group Button */}
    //       <Drawer.Screen name="Chat Room" component={GeneralChatRoom} />
    //       <Drawer.Screen name="About" component={About} />
    //     </Drawer.Navigator>
    //   </NavigationContainer>);
    // } else if (isViewingLandingPage) {
    //   return (<NavigationContainer>
    //     <Drawer.Navigator initialRouteName="P2PLanding">
    //       <Drawer.Screen name="Home" component={P2PLanding} />
    //       <Drawer.Screen name="Login" component={Login} />
    //     </Drawer.Navigator>
    //   </NavigationContainer>);
    // }
  }
}

export default App;
