/* eslint-disable max-len, global-require */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { About } from '../../../screens/common/functional-components/About';
import { Copyright } from '../../../screens/common/functional-components/Copyright';
import { FAQ } from '../../../screens/common/functional-components/FAQ';
import { Privacy } from '../../../screens/common/functional-components/Privacy';

const Stack = createStackNavigator();

export const CommonStackWrapper = (props: any) => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {props.children}
                <Stack.Screen name='Copyright' component={Copyright} options={Copyright.navigationOptions} />
                <Stack.Screen name='Privacy' component={Privacy} options={Privacy.navigationOptions} />
                <Stack.Screen name='FAQ' component={FAQ} options={FAQ.navigationOptions} />
                <Stack.Screen name='About' component={About} options={About.navigationOptions} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
