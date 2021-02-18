/* eslint-disable max-len, global-require */
import React, { memo } from 'react';
import { View } from 'react-native';
import { CustomButton } from '../../../components/common/functional-components/CustomButton';
import { BgImage } from '../../../components/common/functional-components/BgImage';
import { Login } from '../../../components/Guest/class-components/Login';
import { Register } from '../../../components/Guest/functional-components/Register';

const GuestScreen = memo((props) => {
    const { navigation } = props;

    return (
        <View style={{ alignItems: 'center' }}>
            <BgImage />
            <Login btnTitle="Iniciar sesión" navigation={navigation} />
            <Register btnTitle="Registrarse " btnStyle={{ backgroundColor: '#00b7e0' }} navigation={navigation} />
            <CustomButton
                btnTitle="Quiero ver lo que me espera!"
                btnStyle={{ backgroundColor: 'transparent', marginTop: 10 }}
                btnRaised={false}
                shadow={{}}
                btnTitleStyle={{ color: '#00b7e0', fontSize: 16 }}
                action={() => {
                    navigation.navigate('Drawer', {
                        screen: 'Moodem'
                    });
                }}
            />
        </View>
    );
});

GuestScreen.navigationOptions = () => ({
    headerShown: false,
    unmountOnBlur: true
});

export {
    GuestScreen
};

