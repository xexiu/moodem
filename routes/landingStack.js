import { Icon } from 'react-native-elements';
import Login from '../screens/Login';
import Register from '../screens/Register';

/* eslint-disable max-len */

const navigationOptions = {
	defaultNavigationOptions: {
		headerStyle: {
			backgroundColor: '#f4511e' // red-orange of the header
		},
		headerTintColor: 'white',
		headerTitleStyle: {
			textAlign: 'center',
			alignSelf: 'center',
			fontSize: 20,
			color: '#fff',
			fontWeight: 'bold'
		}
	}
};


function openSideBar(navigation) {
	return function () {
		return navigation.openDrawer();
	};
}


function buildIcon(icon, style, size, color, action) {
	return (<Icon
		name={icon}
		style={style}
		size={size}
		color={color}
		onPress={action}
	/>);
}

function navigateTo(navigation, screenName) {
	return function () {
		return navigation.navigate(screenName, {
			user: 'User Name' //firebase.auth()
		});
	};
}

const screens = {
    Login: {
        screen: Login,
        navigationOptions: ({ navigation }) => ({
            title: 'Login',
            // headerStyle: { backgroundColor: 'red' }
            // header: null
            headerRight: buildIcon('home', { width: 60 }, 30, 'white', navigateTo(navigation, 'LandingUserScreen')),
            headerLeft: buildIcon('long-arrow-left', { width: 60 }, 30, 'white', () => { navigation.goBack(null); })
            // headerLeft: buildIcon('bars', headerButtons.btnLeftStyle, 30, 'white', openSideBar(navigation))
        })
    },
    Register: {
        screen: Register,
        navigationOptions: {
            title: 'Register',
            // headerStyle: { backgroundColor: 'red' }
        }
    }
};

// const LandingStack = createStackNavigator(screens, navigationOptions);

// export default LandingStack;
