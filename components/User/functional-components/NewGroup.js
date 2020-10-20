/* eslint-disable max-len */
import React, { useState } from 'react';
import { form, struct, } from 'tcomb-form-native';
import { View, Text } from 'react-native';
import { formValidationGroup } from '../../../src/js/Utils/Helpers/validators/formValidator';
import { FORM_FIELDS_CREATE_GROUP } from '../../../src/js/Utils/constants/form';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { CustomModal } from '../../common/functional-components/CustomModal';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { createGroupHandler } from '../../../src/js/Utils/Helpers/actions/groups';

const Form = form.Form;

const createNewGroup = (data, handleNewGroup) => {
    data.once('value')
        .then(snapshot => {
            const group = snapshot.val();
            handleNewGroup(group);
        });
};

const handleCreateGroup = (refGroupForm, setNewGroup, user, handleNewGroup, toggleModal, value) => {
    const validate = refGroupForm.current.getValue();

    console.log('VALIdT', validate);

    if (validate) {
        setNewGroup({ isLoading: true, value });
        createGroupHandler(validate, user)
            .then(data => {
                createNewGroup(data, handleNewGroup);
                setNewGroup({ isLoading: false, value: '' });
                toggleModal(false);
            })
            .catch(err => {
                setNewGroup({ isLoading: false, errorText: err, value });
                toggleModal(true);
            });
    }
};

export const NewGroup = (props) => {
    const {
        toggleModal,
        showModal,
        user,
        handleNewGroup
    } = props;
    const [{ isLoading = false, errorText = '', value = '' }, setFormValues] = useState({});
    const refGroupForm = React.createRef();
    const groupForm = struct({
        group_name: formValidationGroup.group_name,
        group_password: formValidationGroup.group_password,
        invited_emails: formValidationGroup.invited_emails
    });
    const GroupFormOptions = {
        fields: FORM_FIELDS_CREATE_GROUP
    };

    return (
        <View style={{ alignSelf: 'center', padding: 5 }}>
            <CustomModal isModalVisible={showModal} onBackdropPress={() => toggleModal(false)}>
                <Form
                    ref={refGroupForm}
                    type={groupForm}
                    value={value}
                    options={GroupFormOptions}
                    onChange={text => {
                        setFormValues({ value: text });
                        toggleModal(true);
                    }}
                />
                {isLoading ?
                    <PreLoader containerStyle={{ alignItems: 'center' }} /> :
                    <CustomButton
                        btnTitle="Create"
                        action={() => handleCreateGroup(refGroupForm, setFormValues, user, handleNewGroup, toggleModal, value)}
                    />
                }
                {
                    !!errorText &&
                    <View>
                        <Text style={{ textAlign: 'center', margin: 10, color: '#dd0031' }}>{errorText}</Text>
                    </View>
                }
            </CustomModal>
        </View>
    );
};
