/* eslint-disable max-len, global-require */
import AbortController from 'abort-controller';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import { form, struct } from 'tcomb-form-native';
import { GroupEmpty } from '../../../screens/User/functional-components/GroupEmpty';
import { createInvitedGroup, getAllGroups, getGroups } from '../../../src/js/Utils/Helpers/actions/groups';
import { formValidationGroup } from '../../../src/js/Utils/Helpers/validators/formValidator';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { CustomModal } from '../../common/functional-components/CustomModal';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { NewGroup } from './NewGroup';

const Form = form.Form;

const Groups = (props: any) => {
    const controller = new AbortController();
    const { user, group } = props.route.params;
    const { navigation } = props;
    const [showModal, setModal] = useState(false);
    const [userGroup = null, setUserGroup] = useState(null);
    const [showPasswordModal, setPasswordModal] = useState(false);
    const [errorPassword, setErrorPassword] = useState('');
    const [{ groups, loaded }, setGroups] = useState({groups: [], loaded: false});
    const [{ searchedGroups }, setSearchedGroups] = useState({searchedGroups: []});
    const [{ value }, setPasswordFormValue] = useState({ value: ''});
    const refPassWordForm = React.createRef();
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        console.log('3. Groups');
        getGroups(user)
            .then((dbGroups) => setGroups({
                groups: dbGroups as never[],
                loaded: true
            }))
            .catch(err => console.log('Something happened', err));

        return () => {
            controller.abort();
        };
    }, [!!group.length]);

    const renderItem = (_group: any) => (
        <CommonFlatListItem
            bottomDivider
            title={_group.group_name}
            subtitle={_group.group_id}
            rightTitle={_group.group_password}
            action={() => {
                setUserGroup(_group);
                setPasswordModal(true);
            }}
        />
    );

    const togglePasswordModal = (_showModal: boolean) => {
        setPasswordModal(_showModal);
        setErrorPassword('');
    };

    const toggleModal = (_showModal: boolean) => {
        setModal(_showModal);
    };

    const handleNewGroup = (newGroup: never) => {
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

    const searchGroups = (text: string) => getAllGroups().then((data: any) => {
        for (const _group of data) {
            if (_group.group_name.indexOf(text) >= 0) {
                if (user.uid !== _group.user_owner_id && _group.group_users_count.users.indexOf(user.uid) < 0) {
                    searchedGroups.push(_group as never);
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
                            password: formValidationGroup.group_password
                        })}
                        value={value}
                        onChange={(text: string) => {
                            setPasswordFormValue({ value: text });
                        }}
                    />
                    <CustomButton
                        btnTitle='OK'
                        action={() => {
                            if (value && value.password === userGroup.group_password) {
                                createInvitedGroup(user, userGroup);
                                togglePasswordModal(false);
                                setPasswordFormValue({ value: '' });

                                if (isSearching) {
                                    setGroups({
                                        groups: [...groups, userGroup] as never,
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
                        btnTitle='Cancel'
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
                    placeholder='Search group...'
                    cancelSearch={() => {
                        setIsSearching(false);
                        setSearchedGroups([] as never);
                    }}
                    onEndEditingSearch={searchGroups}
                    customStyleContainer={{ width: '85%', marginLeft: 55 }}
                />
                {isSearching ?
                    <CommonFlatList
                        emptyListComponent={GroupEmpty}
                        data={searchedGroups}
                        action={({ item }) => renderItem(item)}
                    /> :
                    <CommonFlatList
                        emptyListComponent={GroupEmpty}
                        headerComponent={<View style={{ alignSelf: 'center', marginBottom: 10 }}><CustomButton btnTitle='Create Group' action={() => toggleModal(true)} /></View>}
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
};

Groups.navigationOptions = ({ route }) => {
    // console.log('Groups Navigation Options', route);
    return {
        title: 'My Groups'
    };
};

Groups.propTypes = {
    navigation: PropTypes.object
};

memo(Groups);

export {
    Groups
};
