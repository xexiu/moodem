/* eslint-disable max-len */
import React, { Component } from 'react';
import { form, struct } from 'tcomb-form-native';
import { View, Text, TouchableHighlight } from 'react-native';
import { CustomButton } from '../functional-components/CustomButton';
import { CustomModal } from '../functional-components/CustomModal';
import { loginHandler } from '../../../src/js/Utils/Helpers/actions/loginHandler';
import { formValidation } from '../../../src/js/Utils/Helpers/validators/formValidator';
import { FORM_FIELDS_LOGIN } from '../../../src/js/Utils/constants/form';
import { loginText } from '../../../src/css/styles/login';
import { PreLoader } from '../functional-components/PreLoader';
import { ResetPassword } from '../../common/class-components/ResetPassword';

const Form = form.Form;

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoginModalVisible: false,
            isLoading: false,
            hasForgotPassword: false,
            errorText: ''
        };
        this.refForm = React.createRef();
        this.user = struct({
            email: formValidation.email,
            password: formValidation.password
        });
        this.options = {
            fields: FORM_FIELDS_LOGIN
        };
    }

    onBackdropPressHandler = () => {
        this.setState({ isLoginModalVisible: false });
    }

    toggleModal = () => {
        this.setState({ isLoginModalVisible: !this.state.isLoginModalVisible });
    }

    forgotPasswordHandler = (data) => {
        this.setState({ hasForgotPassword: data.hasForgotPassword });
    }

    render() {
        const {
            isLoginModalVisible,
            isLoading,
            errorText,
            hasForgotPassword
        } = this.state;
        const {
            btnTitle,
            btnStyle,
            loginHandlerGuest
        } = this.props;

        console.log('Render login()', isLoading);

        if (hasForgotPassword) {
            return (
                <View style={{ alignItems: 'center', padding: 5 }}>
                    <ResetPassword hasForgotPassword={hasForgotPassword} forgotPasswordHandler={this.forgotPasswordHandler} />
                </View>
            );
        }

        return (
            <View style={{ alignItems: 'center', padding: 5 }}>
                <CustomButton
                    btnTitle={btnTitle}
                    btnStyle={btnStyle}
                    btnOnPress={this.toggleModal}
                />

                <CustomModal isModalVisible={isLoginModalVisible} onBackdropPress={this.onBackdropPressHandler}>
                    <Text style={loginText}>You have the keys!</Text>
                    <Form
                        ref={this.refForm} // this.refs.form would be the reference
                        type={this.user}
                        options={this.options}
                    />

                    {isLoading ?
                        <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                        <CustomButton
                            btnTitle="Login"
                            btnStyle={btnStyle}
                            btnOnPress={() => {
                                const validate = this.refForm.current.getValue();

                                if (validate) {
                                    this.setState({ isLoading: true });
                                    loginHandler(validate)
                                        .then(user => {
                                            this.setState({ isLoading: false });
                                            loginHandlerGuest(user);
                                        })
                                        .catch(err => {
                                            this.setState({ isLoading: false, errorText: err });
                                        });
                                }
                            }}
                        />
                    }
                    {
                        !!errorText &&
                        <View>
                            <Text style={{ textAlign: 'center', margin: 10, color: '#222' }}>{errorText}</Text>
                            <TouchableHighlight
                                underlayColor={'#f0f0f0'}
                                onPress={() => {
                                    this.setState({ isLoginModalVisible: false, hasForgotPassword: true, errorText: '' });
                                    loginHandlerGuest({ hasForgotPassword: true });
                                }}
                            >
                                <Text style={{ textAlign: 'center', margin: 10, color: '#dd0031' }}>Forgot password?</Text>
                            </TouchableHighlight>
                        </View>
                    }
                </CustomModal>
            </View>
        );
    }
}
