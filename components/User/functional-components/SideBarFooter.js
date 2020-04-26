import React from 'react';
import { View } from 'react-native';
import { Copyright } from './Copyright';
import { Disclaimer } from './Disclaimer';
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
            <Disclaimer navigation={navigation} />
            <FAQ navigation={navigation} />
            <About navigation={navigation} />
        </View>
    );
};
