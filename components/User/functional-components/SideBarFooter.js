import React from 'react';
import { View } from 'react-native';
import { Copyright } from './Copyright';
import { Privacy } from './Privacy';
import { FAQ } from './FAQ';
import { About } from './About';
import { sideBarFooterContainer } from '../../../src/css/styles/SideBarFooter';

export const SideBarFooter = (props) => {
    const {
        navigation
    } = props;
    return (
        <View style={sideBarFooterContainer}>
            <Copyright navigation={navigation} />
            <FAQ navigation={navigation} />
            <About navigation={navigation} />
            <Privacy navigation={navigation} />
        </View>
    );
};
