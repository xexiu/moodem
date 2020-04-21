
import About from '../screens/About';

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


const screens = {
    About: {
        screen: About,
        navigationOptions: ({ navigation }) => ({
            title: 'About'
        })
    }
};

// const AboutStack = createStackNavigator(screens, navigationOptions);

// export default AboutStack;
