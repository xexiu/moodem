/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
import React, { Component } from 'react';
import t from 'tcomb-form-native';
import { View, Text } from 'react-native';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { CustomModal } from '../../common/functional-components/CustomModal';
import { resetPasswordHandler } from '../../../src/js/Utils/Helpers/actions/resetPasswordHandler';
import { formValidation } from '../../../src/js/Utils/Helpers/validators/formValidator';
import { loginText } from '../../../src/css/styles/login';
import { PreLoader } from '../../common/functional-components/PreLoader';

const Form = t.form.Form;

export class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            isResetPasswordModalVisible: true,
            isLoading: false,
            errorText: ''
        };
        this.refForm = React.createRef();
        this.user = t.struct({
            email: formValidation.email
        });
        this.options = {
            fields: {
                email: {
                    help: 'Enter your email (new password will be sent here)',
                    error: 'Incorrect email or bad format!',
                    autoCapitalize: 'none'
                }
            }
        };
    }

    componentDidMount() {
        this.setState({ isResetPasswordModalVisible: true });
    }

    onBackdropPressHandler = () => {
        this.setState({ isResetPasswordModalVisible: false });
    }

    render() {
        const {
            isResetPasswordModalVisible,
            isLoading,
            errorText
        } = this.state;
        const {
            btnTitle = 'Reset Password',
            btnStyle,
            loginHandlerGuest
        } = this.props;

        return (
            <CustomModal
                isModalVisible={isResetPasswordModalVisible} onBackdropPress={() => {
                    this.onBackdropPressHandler();
                    loginHandlerGuest({ hasForgotPassword: false });
                }}
            >
                <Text style={loginText}>Give me my keys back!</Text>
                <Form
                    ref={this.refForm}
                    type={this.user}
                    options={this.options}
                />

                {isLoading ?
                    <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                    <CustomButton
                        btnTitle={btnTitle}
                        btnStyle={btnStyle}
                        action={() => {
                            const validate = this.refForm.current.getValue();

                            if (validate) {
                                this.setState({ isLoading: true });
                                resetPasswordHandler(validate)
                                    .then(() => {
                                        this.setState({ isLoading: false });
                                        loginHandlerGuest({ hasForgotPassword: false });
                                    })
                                    .catch(err => this.setState({ isLoading: false, errorText: err }));
                            }
                        }}
                    />
                }
                {
                    !!errorText &&
                    <View>
                        <Text style={{ textAlign: 'center', margin: 10, color: '#222' }}>{errorText}</Text>
                    </View>
                }
            </CustomModal>
        );
    }
}
