/* eslint-disable max-len */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { form, struct } from 'tcomb-form-native';
import { CustomModal } from '../../../components/common/functional-components/CustomModal';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import { FORM_FIELDS_CREATE_GROUP } from '../../../src/js/Utils/constants/form';
import { createGroupHandler } from '../../../src/js/Utils/Helpers/actions/groups';
import { formValidationGroup } from '../../../src/js/Utils/Helpers/validators/formValidator';
import CustomButton from '../../common/functional-components/CustomButton';

const Form = form.Form;

export class CreateGroup extends Component {
    public state: any;
    public refForm: any;
    public group: any;
    public options: any;
    public setState: any;
    public props: any;
    public isCreateGroupModalVisible: any;
    public isLoading: any;
    public errorText: any;
    public user: any;
    public handleNewCreateGroup: any;
    static navigationOptions = () => ({
        headerMode: 'none',
        headerShown: false
    });

    constructor(props) {
        super(props);

        this.state = {
            isCreateGroupModalVisible: false,
            isLoading: false,
            errorText: ''
        };
        this.refForm = React.createRef();
        this.group = struct({
            group_name: formValidationGroup.group_name,
            group_password: formValidationGroup.group_password
        });
        this.options = {
            fields: FORM_FIELDS_CREATE_GROUP
        };
    }

    onBackdropPressHandler = () => {
        this.setState({ isCreateGroupModalVisible: false });
    };

    toggleModal = () => {
        this.setState({ isCreateGroupModalVisible: !this.state.isCreateGroupModalVisible });
    };

    render() {
        const {
            isCreateGroupModalVisible,
            isLoading,
            errorText
        } = this.state;

        const {
            user,
            handleNewCreateGroup
        } = this.props;

        return (
            <View style={{ alignSelf: 'center', padding: 5 }}>
                <CustomButton btnTitle='Create Group' action={this.toggleModal} style={{ alignItems: 'flex-end' }} />

                <CustomModal isModalVisible={isCreateGroupModalVisible} onBackdropPress={this.onBackdropPressHandler}>
                    <Form
                        ref={this.refForm} // this.refs.form would be the reference
                        type={this.group}
                        options={this.options}
                    />

                    {isLoading ?
                        <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                        <CustomButton
                            btnTitle='Create'
                            action={() => {
                                const validate = this.refForm.current.getValue();

                                if (validate) {
                                    this.setState({ isLoading: true });

                                    createGroupHandler(validate, user)
                                    .then(data => {
                                        handleNewCreateGroup(data);
                                        this.setState({ isLoading: false }); // after setting the groupName - promise - DB?
                                        this.onBackdropPressHandler();
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
                        </View>
                    }
                </CustomModal>
            </View>
        );
    }
}
