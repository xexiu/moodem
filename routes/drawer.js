import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import LandingStack from './landingStack';
import AboutStack from './aboutStack';

const RootDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: LandingStack
    },
    About: {
        screen: AboutStack
    }
});

