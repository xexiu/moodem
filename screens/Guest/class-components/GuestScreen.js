/* eslint-disable max-len, global-require */
import React, { Component } from 'react';
import { View } from 'react-native';
import { CustomButton } from '../../../components/common/functional-components/CustomButton';
import { BgImage } from '../../../components/common/functional-components/BgImage';
import { Login } from '../../../components/Guest/class-components/Login';
import { Register } from '../../../components/Guest/class-components/Register';
import { ResetPassword } from '../../../components/Guest/class-components/ResetPassword';

export class GuestScreen extends Component {
    static navigationOptions = screeenProps => ({
        headerShown: false,
        unmountOnBlur: true
    });

    constructor(props) {
        super(props);
        this.state = {
            hasForgotPassword: false
        };
    }

    loginHandlerGuest = (data, navigation) => {
        if (data.user) {
            navigation.navigate('Drawer', {
                screen: 'Moodem',
                params: {
                    user: data.user
                }
            });
        } else {
            this.setState({ hasForgotPassword: data });
        }
    }

    render() {
        const {
            navigation
        } = this.props;
        const {
            hasForgotPassword
        } = this.state;

        return (
            <View style={{ alignItems: 'center' }}>
                <BgImage source={require('../../../assets/images/logo_moodem.png')} />

                <Login btnTitle="Login to Moodem" loginHandlerGuest={data => this.loginHandlerGuest(data, navigation)} />
                <Register btnTitle="Become a Mooder" btnStyle={{ backgroundColor: '#00b7e0' }} navigation={navigation} />
                {hasForgotPassword && <ResetPassword loginHandlerGuest={this.loginHandlerGuest} />}
                <CustomButton
                    btnTitle="I want to see what's inside first!"
                    btnStyle={{ backgroundColor: 'transparent', marginTop: 10 }}
                    btnRaised={false}
                    shadow={{}}
                    btnTitleStyle={{ color: '#00b7e0', fontSize: 16 }}
                    action={() => navigation.navigate('Drawer', {
                        screen: 'Moodem'
                    })}
                />
            </View>
        );
    }
}

