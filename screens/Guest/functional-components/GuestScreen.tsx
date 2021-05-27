/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import BgImage from '../../../components/common/functional-components/BgImage';
import Login from '../../../components/Guest/class-components/Login';
import Register from '../../../components/Guest/functional-components/Register';

const GuestScreen = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            unmountOnBlur: true,
            headerMode: 'none'
        });
        return () => {

        };
    }, [isFocused]);

    return (
        <View style={{ alignItems: 'center' }}>
            <BgImage />
            <Login btnTitle='Iniciar sesión' navigation={navigation} />
            <Register btnTitle='Registrarse ' btnStyle={{ backgroundColor: '#00b7e0' }} navigation={navigation} />
        </View>
    );
};

GuestScreen.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object,
    navigationOptions: PropTypes.any
};

export default memo(GuestScreen);
