/* eslint-disable max-len, global-require */
import React, { useState, useEffect, memo } from 'react';
import { View, Text, Keyboard } from 'react-native';
import AbortController from 'abort-controller';
import { getGroups, getAllGroups, createInvitedGroup } from '../../../src/js/Utils/Helpers/actions/groups';
import { GroupEmpty } from '../../../screens/User/functional-components/GroupEmpty';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { NewGroup } from './NewGroup';
import { form, struct } from 'tcomb-form-native';
import { formValidationGroup } from '../../../src/js/Utils/Helpers/validators/formValidator';
import { CustomModal } from '../../common/functional-components/CustomModal';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';

const Form = form.Form;

const renderItem = (group, setPasswordModal, setUserGroup) => (
    <CommonFlatListItem
        bottomDivider
        title={group.group_name}
        subtitle={group.group_id}
        rightTitle={group.group_password}
        action={() => {
            setUserGroup(group);
            setPasswordModal(true);
        }}
    />
);

const Groups = memo((props) => {
    const controller = new AbortController();
    const { user, group } = props.route.params;
    const { navigation } = props;
    const [showModal, setModal] = useState(false);
    const [userGroup = null, setUserGroup] = useState(null);
    const [showPasswordModal, setPasswordModal] = useState(false);
    const [errorPassword = '', setErrorPassword] = useState('');
    const [{ groups = [], loaded = false }, setGroups] = useState({});
    const [{ searchedGroups = [] }, setSearchedGroups] = useState({});
    const [{ value = '' }, setPasswordFormValue] = useState('');
    const refPassWordForm = React.createRef();
    const [isSearching = false, setIsSearching] = useState(false);

    useEffect(() => {
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
        setErrorPassword('');
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

    const searchGroups = (text) => getAllGroups().then(data => {
        for (let i = 0; i < Object.values(data).length; i++) {
            const cleanGroup = Object.values(data)[i];

            if (cleanGroup.group_name.indexOf(text) >= 0) {
                if (user.uid !== cleanGroup.user_owner_id && cleanGroup.group_users_count.users.indexOf(user.uid) < 0) {
                    searchedGroups.push(cleanGroup);
                    setIsSearching(true);
                    setSearchedGroups({
                        searchedGroups: [...searchedGroups]
                    });
                }
            }
        }
    });

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
                            if (value && value.password === userGroup.group_password) {
                                createInvitedGroup(user, userGroup);
                                togglePasswordModal(false);
                                setPasswordFormValue({ value: '' });

                                if (isSearching) {
                                    setGroups({
                                        groups: [...groups, userGroup],
                                        loaded: true
                                    });
                                    setIsSearching(false);
                                } else {
                                    Object.assign(props.route.params.group, {
                                        group: {
                                            ...userGroup
                                        }
                                    });
                                    navigation.navigate('Moodem', {
                                        group: {
                                            ...userGroup
                                        }
                                    });
                                }
                            } else {
                                setErrorPassword('Password incorrect!');
                            }
                        }}
                    />
                    <CustomButton
                        btnTitle="Cancel"
                        btnStyle={{
                            backgroundColor: '#00b7e0',
                            marginTop: 10,
                            width: 200,
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                        action={() => {
                            setIsSearching(false);
                            togglePasswordModal(false);
                            setErrorPassword('');
                        }}
                    />
                    <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{errorPassword}</Text>
                </CustomModal>
            </View>

            <View>
                <BurgerMenuIcon
                    action={() => {
                        navigation.openDrawer();
                        Keyboard.dismiss();
                        setIsSearching(false);
                    }
                    }
                />
                <NewGroup showModal={showModal} toggleModal={toggleModal} user={user} handleNewGroup={handleNewGroup} />
                <CommonTopSearchBar
                    placeholder="Search group..."
                    cancelSearch={() => {
                        setIsSearching(false);
                        setSearchedGroups([]);
                    }}
                    onEndEditingSearch={searchGroups}
                    customStyleContainer={{ width: '85%', marginLeft: 55 }}
                />
                {isSearching ?
                    <CommonFlatList
                        emptyListComponent={GroupEmpty}
                        data={searchedGroups}
                        action={({ item }) => renderItem(item, setPasswordModal, setUserGroup)}
                    /> :
                    <CommonFlatList
                        emptyListComponent={GroupEmpty}
                        headerComponent={<View style={{ alignSelf: 'center', marginBottom: 10 }}><CustomButton btnTitle="Create Group" action={() => toggleModal(true)} /></View>}
                        data={groups}
                        action={({ item }) => (<CommonFlatListItem
                            bottomDivider
                            title={item.group_name}
                            subtitle={item.group_id}
                            rightTitle={item.user_owner_id === user.uid ? 'Owner' : 'Invited'}
                            action={() => {
                                setUserGroup(item);
                                Object.assign(props.route.params.group, item);
                                navigation.navigate('Moodem', {
                                    group: {
                                        ...item
                                    }
                                });
                            }}
                        />)}
                    />
                }
            </View>
        </View>
    );
});

Groups.navigationOptions = ({ route }) => ({
    title: 'My Groups'
});

export {
    Groups
};
