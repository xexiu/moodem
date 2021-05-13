/* eslint-disable max-len, global-require */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import About from '../../../screens/common/functional-components/About';
import Copyright from '../../../screens/common/functional-components/Copyright';
import FAQ from '../../../screens/common/functional-components/FAQ';
import Privacy from '../../../screens/common/functional-components/Privacy';
import SearchingSongsScreen from '../../../screens/User/functional-components/SearchingSongsScreen';

const Stack = createStackNavigator();

export const CommonStackWrapper = (props: any) => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {props.children}
                <Stack.Screen name='Copyright' component={Copyright} />
                <Stack.Screen name='Privacy' component={Privacy} />
                <Stack.Screen name='FAQ' component={FAQ} />
                <Stack.Screen name='About' component={About} />
                <Stack.Screen name='SearchingSongsScreen' component={SearchingSongsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
