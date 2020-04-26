/* eslint-disable max-len, global-require */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Copyright } from '../../../screens/common/functional-components/Copyright';
import { Disclaimer } from '../../../screens/common/functional-components/Disclaimer';
import { FAQ } from '../../../screens/common/functional-components/FAQ';
import { About } from '../../../screens/common/functional-components/About';

const Stack = createStackNavigator();

export const CommonStackWrapper = (props) => {
    const {
        initialRouteName
    } = props;

    return (
        <NavigationContainer initialRouteName={initialRouteName}>
            <Stack.Navigator>
                {props.children}
                <Stack.Screen name="Copyright" component={Copyright} options={Copyright.navigationOptions} />
                <Stack.Screen name="Disclaimer" component={Disclaimer} options={Disclaimer.navigationOptions} />
                <Stack.Screen name="FAQ" component={FAQ} options={FAQ.navigationOptions} />
                <Stack.Screen name="About" component={About} options={About.navigationOptions} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

