/* eslint-disable max-len, global-require */
import React, { useState, useEffect, useContext, memo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import AbortController from 'abort-controller';
import Toast from 'react-native-easy-toast';
import firebase from '../../../src/js/Utils/Helpers/services/firebase';
import { getGroupName, getGroups } from '../../../src/js/Utils/Helpers/actions/groups';
import { isEmpty } from '../../../src/js/Utils/common';
import { GroupEmpty } from '../../../screens/User/functional-components/GroupEmpty';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { BgImage } from '../../common/functional-components/BgImage';
import { UserContext } from './UserContext';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { NewGroup } from './NewGroup';
import { form, struct } from 'tcomb-form-native';
import { formValidationGroup } from '../../../src/js/Utils/Helpers/validators/formValidator';
import { CustomModal } from '../../common/functional-components/CustomModal';

const Form = form.Form;

const renderItem = (group, setPasswordModal) => (
    <CommonFlatListItem
        bottomDivider
        title={group.group_name}
        subtitle={group.group_id}
        rightTitle={group.group_password}
        action={() => setPasswordModal(true)}
    />
);

const Groups = memo((props) => {
    const controller = new AbortController();
    const { user, group } = useContext(UserContext);
    const { navigation } = props;
    const [showModal, setModal] = useState(false);
    const [userGroup = null, setUserGroup] = useState(null);
    const [showPasswordModal, setPasswordModal] = useState(false);
    const [{ groups = [], loaded = false }, setGroups] = useState({});
    const [{ value = '' }, setPasswordFormValue] = useState('');
    const refPassWordForm = React.createRef();

    useEffect(() => {
        //console.log('BLAAAAA');
        getGroups(user)
            .then((dbGroups) => setGroups({
                groups: dbGroups,
                loaded: true
            }))
            .catch(err => console.log('Something happened', err));

        return () => {
            controller.abort();
        };
    }, [!!group.length]);

    const togglePasswordModal = (_showModal) => {
        setPasswordModal(_showModal);
    };

    const toggleModal = (_showModal) => {
        setModal(_showModal);
    };

    const handleNewGroup = (newGroup) => {
        setGroups({
            groups: [...groups, newGroup],
            loaded: true
        });
    };

    if (!user) {
        navigation.navigate('Guest');
    } else if (!loaded) {
        return (<PreLoader
            size={50}
            containerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        />);
    }

    return (
        <View style={{ marginTop: 35, padding: 10, position: 'relative', flex: 1, backgroundColor: 'transparent' }}>
            <View>
                <CustomModal isModalVisible={showPasswordModal} onBackdropPress={() => togglePasswordModal(false)}>
                    <Form
                        ref={refPassWordForm}
                        type={struct({
                            password: formValidationGroup.group_password,
                        })}
                        value={value}
                        onChange={text => {
                            setPasswordFormValue({ value: text });
                        }}
                    />
                    <CustomButton
                        btnTitle="OK" action={() => {
                            console.log('PRESSSSED', value.password, 'Group PASS', userGroup.group_password);
                            if (value && value.password === userGroup.group_password) {
                                console.log('PASS MATCH', navigation);
                                navigation.navigate()
                            } else {
                                console.log('PAss nOT MATCH');
                            }
                        }}
                    />
                </CustomModal>
            </View>

            <View>
                <BurgerMenuIcon action={() => navigation.openDrawer()} />
                <NewGroup showModal={showModal} toggleModal={toggleModal} user={user} handleNewGroup={handleNewGroup} />
                <CommonFlatList
                    emptyListComponent={GroupEmpty}
                    headerComponent={<View style={{ alignSelf: 'center', marginBottom: 10 }}><CustomButton btnTitle="Create Group" action={() => toggleModal(true)} /></View>}
                    data={groups}
                    action={({ item }) => {
                        console.log('GROOUPS from DB', groups);
                        setUserGroup(item);
                        return renderItem(item, setPasswordModal);
                    }}
                />
            </View>
        </View>
    );
});

Groups.navigationOptions = ({ route }) => ({
    title: getGroupName(route.params.group.group_name, 'Groups')
});

export {
    Groups
};
