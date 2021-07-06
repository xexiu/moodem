/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import BgImage from '../../../components/common/functional-components/BgImage';
import Login from '../../../components/Guest/functional-components/Login';
import Register from '../../../components/Guest/functional-components/Register';
import { COMMON_NAVIGATION_OPTIONS } from '../../../src/js/Utils/constants/navigation';

const GuestScreen = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
            ...COMMON_NAVIGATION_OPTIONS,
            headerShown: false
        });
        return () => {

        };
    }, [isFocused]);

    return (
        <View style={{ alignItems: 'center' }}>
            <BgImage />
            <Login />
            <Register />
        </View>
    );
};

GuestScreen.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object,
    navigationOptions: PropTypes.any
};

export default memo(GuestScreen);
