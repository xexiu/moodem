/* eslint-disable max-len */
import React, { Component } from 'react';
import { form, refinement, struct, String } from 'tcomb-form-native';
import { View, Text, ScrollView } from 'react-native';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { CustomModal } from '../../common/functional-components/CustomModal';
import { registerHandler } from '../../../src/js/Utils/Helpers/actions/registerHandler';
import { formValidation } from '../../../src/js/Utils/Helpers/validators/formValidator';
import { FORM_FIELDS_REGISTER } from '../../../src/js/Utils/constants/form';
import { btnStyleDefault } from '../../../src/css/styles/customButton';
import { registerText } from '../../../src/css/styles/register';
import { PreLoader } from '../../common/functional-components/PreLoader';

const Form = form.Form;

export class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegisterModalVisible: false,
            isLoading: false,
            errorText: '',
            user: {
                email: '',
                password: ''
            }
        };
        this.refForm = React.createRef();
        this.samepassword = refinement(String, (s) => s === this.state.user.password);
        this.user = struct({
            name: formValidation.name,
            email: formValidation.email,
            password: formValidation.password,
            password_confirmation: this.samepassword
        });
        this.options = {
            fields: FORM_FIELDS_REGISTER
        };
    }

    onBackdropPressHandler = () => {
        this.setState({ isRegisterModalVisible: false });
    }

    onChange(user) {
        this.setState({ user });
    }

    toggleModal = () => {
        this.setState({ isRegisterModalVisible: !this.state.isRegisterModalVisible });
    }

    render() {
        const {
            isRegisterModalVisible,
            isLoading,
            errorText
        } = this.state;
        const {
            btnTitle,
            btnStyle,
            navigation
        } = this.props;

        return (
            <ScrollView>
                <View>
                    <CustomButton
                        btnTitle={btnTitle}
                        btnStyle={[btnStyleDefault, btnStyle]}
                        action={this.toggleModal}
                    />

                    <CustomModal isModalVisible={isRegisterModalVisible} onBackdropPress={this.onBackdropPressHandler}>
                        <Text style={registerText}>Knock Knock!!</Text>
                        <Form
                            ref={this.refForm} // this.refs.form would be the reference
                            type={this.user}
                            options={this.options}
                            onChange={(evt) => this.onChange(evt)}
                            value={this.state.user}
                        />
                        {isLoading ?
                            <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                            <CustomButton
                                btnTitle="Register"
                                btnStyle={[btnStyleDefault, btnStyle]}
                                action={() => {
                                    const validate = this.refForm.current.getValue();

                                    if (validate) {
                                        this.setState({ isLoading: true });
                                        registerHandler(validate)
                                            .then((data) => {
                                                this.setState({ isLoading: false, isRegisterModalVisible: false, errorText: '' });
                                                navigation.navigate('Drawer', {
                                                    screen: 'Moodem',
                                                    params: {
                                                        user: data.user
                                                    }
                                                });
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
                </View>
            </ScrollView>
        );
    }
}
