import React, { memo } from 'react';
import { View } from 'react-native';
import { sideBarFooterContainer } from '../../../src/css/styles/sideBarFooter';
import { About } from './About';
import { Copyright } from './Copyright';
import { FAQ } from './FAQ';
import { Privacy } from './Privacy';

export const SideBarFooter = memo((props: any) => {
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
});
