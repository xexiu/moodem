/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import BgImage from '../../../components/common/functional-components/BgImage';
import Login from '../../../components/Guest/functional-components/Login';
import Register from '../../../components/Guest/functional-components/Register';
import { NavigationOptions } from '../../../src/js/Utils/Helpers/actions/navigation';

const GuestScreen = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();
    const { initMoodem } = props.route.params;

    useEffect(() => {
        navigation.setOptions({
            ...NavigationOptions(navigation),
            headerShown: false
        });
        return () => {

        };
    }, [isFocused]);

    return (
        <View style={{ alignItems: 'center' }}>
            <BgImage />
            <Login initMoodem={initMoodem} />
            <Register initMoodem={initMoodem} />
        </View>
    );
};

export default memo(GuestScreen);
