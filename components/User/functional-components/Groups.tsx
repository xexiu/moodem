/* eslint-disable max-len, global-require */
import AbortController from 'abort-controller';
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import { form, struct } from 'tcomb-form-native';
import { GroupEmpty } from '../../../screens/User/functional-components/GroupEmpty';
import { createInvitedGroup, getAllGroups, getGroups } from '../../../src/js/Utils/Helpers/actions/groups';
import { formValidationGroup } from '../../../src/js/Utils/Helpers/validators/formValidator';
import BurgerMenuIcon from '../../common/BurgerMenuIcon';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import CommonTopSearchBar from '../../common/functional-components/CommonTopSearchBar';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { CustomModal } from '../../common/functional-components/CustomModal';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { AppContext } from '../../User/functional-components/AppContext';
import { NewGroup } from './NewGroup';

const Form = form.Form;

const Groups = (props: any) => {
    const controller = new AbortController();
    const { user, group, dispatch } = useContext(AppContext) as any;
    const { navigation } = props;
    const [showModal, setModal] = useState(false);
    const [userGroup = null, setUserGroup] = useState(null);
    const [showPasswordModal, setPasswordModal] = useState(false);
    const [errorPassword, setErrorPassword] = useState('');
    const [ isLoading, setIsLoading] = useState(true);
    const [{ groups }, setGroups] = useState({groups: [] });
    const [{ searchedGroups }, setSearchedGroups] = useState({searchedGroups: []});
    const [{ value }, setPasswordFormValue] = useState({ value: ''});
    const refPassWordForm = React.createRef();
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        console.log('3. Groups');
        if (user) {
            getGroups(user)
            .then((dbGroups) => {
                setGroups({
                    groups: dbGroups as never[]
                });
                setIsLoading(false);
            })
            .catch(err => console.log('Something happened', err));
        } else {
            setIsLoading(false);
        }

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
            groups: [...groups, newGroup]
        });
        setIsLoading(false);
    };

    const searchGroups = (text: string) => getAllGroups().then((data: any) => {
        const testGroups = [] as any;
        if (!user) {
            navigation.navigate('Guest');
        }
        for (const _group of data) {
            if (_group.group_name.indexOf(text) >= 0) {
                if (user.uid !== _group.user_owner_id && _group.group_users_count.users.indexOf(user.uid) < 0) {
                    testGroups.push(_group as never);
                    setIsSearching(true);
                    setSearchedGroups({
                        searchedGroups: [...testGroups]
                    });
                }
            }
        }
    });

    if (isLoading) {
        return (<PreLoader
            size={50}
            containerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        />);
    }

    console.log('HEYYYYY', user);

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
                                        groups: [...groups, userGroup] as never
                                    });
                                    setIsLoading(false);
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
                            setIsLoading(false);
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
                        setIsLoading(false);
                    }
                    }
                />
                <NewGroup showModal={showModal} toggleModal={toggleModal} user={user} handleNewGroup={handleNewGroup} navigation={navigation} />
                <CommonTopSearchBar
                    placeholder='Search group...'
                    cancelSearch={() => {
                        setIsSearching(false);
                        setSearchedGroups([] as never);
                        setIsLoading(false);
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
                                dispatch({type: 'group', value: item });
                                setUserGroup(item);
                                navigation.navigate(group.group_name);
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
        title: 'Mis Grupos'
    };
};

Groups.propTypes = {
    navigation: PropTypes.object
};

memo(Groups);

export {
    Groups
};
