/* eslint-disable max-len, global-require */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AboutScreen from '../../../screens/common/functional-components/AboutScreen';
import CopyrightScreen from '../../../screens/common/functional-components/CopyrightScreen';
import FAQScreen from '../../../screens/common/functional-components/FAQScreen';
import PrivacyScreen from '../../../screens/common/functional-components/PrivacyScreen';
import SearchingSongsScreen from '../../../screens/Guest/functional-components/SearchingSongsScreen';
import PrivateMessagesScreen from '../../../screens/User/functional-components/PrivateMessagesScreen';
import PrivateUserMessageScreen from '../../../screens/User/functional-components/PrivateUserMessageScreen';

const Stack = createStackNavigator();

export const CommonStackWrapper = (props: any) => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {props.children}
                <Stack.Screen name='Copyright' component={CopyrightScreen} />
                <Stack.Screen name='Privacy' component={PrivacyScreen} />
                <Stack.Screen name='FAQ' component={FAQScreen} />
                <Stack.Screen name='About' component={AboutScreen} />
                <Stack.Screen name='SearchingSongsScreen' component={SearchingSongsScreen} />
                <Stack.Screen name='PrivateMessagesScreen' component={PrivateMessagesScreen} />
                <Stack.Screen name='PrivateUserMessageScreen' component={PrivateUserMessageScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
