import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import CommonFlatList from '../../../components/common/functional-components/CommonFlatList';
import CommonFlatListItem from '../../../components/common/functional-components/CommonFlatListItem';
import CustomModal from '../../../components/common/functional-components/CustomModal';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import AddGroupIcon from '../../../components/User/functional-components/AddGroupIcon';
import ShowPopUpPasswordGroup from '../../../components/User/functional-components/ShowPopUpPasswordGroup';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { SongsContext } from '../../../components/User/store-context/SongsContext';
import { GroupEmpty } from '../../../screens/User/functional-components/GroupEmpty';
import { hasObjWithProp } from '../../../src/js/Utils/common/checkers';
import { USER_AVATAR_DEFAULT } from '../../../src/js/Utils/constants/users';
import {
    addUserToJoinedGroupDB,
    getAllGroups,
    saveJoinedUser
} from '../../../src/js/Utils/Helpers/actions/groups';

const SearchGroupsScreen = (props: any) => {
    const {
        searchedText,
        filter
    } = props.route.params;
    const source = axios.CancelToken.source();
    const { user, dispatchContextApp } = useContext(AppContext) as any;
    const { dispatchContextSongs } = useContext(SongsContext) as any;
    const [allValues, setAllValues] = useState({
        searchedGroups: [],
        isLoading: true
    });
    const navigation = useNavigation<any>();
    const modalRef = useRef() as any;
    const passwordPopUp = useRef() as any;

    const MAP_FILTERS = {
        searchAllGroups: filterGroups,
        searchPublicGroups: filterPublicGroups,
        searchPrivateGroups: filterPrivateGroups
    } as any;

    function filterGroups(group: any) {
        return group.group_name.indexOf(searchedText) >= 0 &&
        group.group_user_owner_id !== user.uid &&
        !hasObjWithProp(group, 'group_users', { user_uid: user.uid });
    }

    function filterPublicGroups(group: any) {
        return group.group_name.indexOf(searchedText) >= 0 &&
        !group.group_password &&
        group.group_user_owner_id !== user.uid &&
        !hasObjWithProp(group, 'group_users', { user_uid: user.uid });
    }

    function filterPrivateGroups(group: any) {
        return group.group_name.indexOf(searchedText) >= 0 &&
        !!group.group_password &&
        group.group_user_owner_id !== user.uid &&
        !hasObjWithProp(group, 'group_users', { user_uid: user.uid });
    }

    async function fetchResults() {
        try {
            const allGroups = await getAllGroups();
            const filteredGroups = allGroups.filter((group: any) => {
                if (filter && Object.keys(filter).length) {
                    return MAP_FILTERS[Object.keys(filter) as any](group);
                }
                return group.group_name.indexOf(searchedText) >= 0;
            });
            return setAllValues(prev => {
                return {
                    ...prev,
                    searchedGroups: [...filteredGroups],
                    isLoading: false
                };
            });
        } catch (err) {
            console.warn('SearchedGroupsScreen error', err);
        }
    }

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true,
            title: `${allValues.searchedGroups.length} encontrado(s)`
        });
        fetchResults();
        return () => {
            source.cancel('SearchGroupsScreen Component got unmounted');
        };
    }, [allValues.searchedGroups.length]);

    const keyExtractor = useCallback((item: any) => item.group_id, []);
    const memoizedItem = useCallback(({ item }) => (
        <View style={{ position: 'relative' }}>
            <CommonFlatListItem
                bottomDivider
                title={item.group_name}
                titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                titleStyle={{ marginTop: -17 }}
                leftAvatar={{
                    source: {
                        uri: USER_AVATAR_DEFAULT
                    }
                }}
                subTitleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
                subtitle={item.group_description}
                chevron={!!item.group_password && {
                    name: 'block',
                    type: 'FontAwesome',
                    color: 'red',
                    raised: false,
                    disabled: true,
                    disabledStyle: {
                        backgroundColor: 'transparent'
                    }
                }}
                action={() => {
                    if (item.group_password) {
                        return handleGroupPassword(item);
                    }
                    return handleSubmit(item);
                }}
            />
        </View>
    ), []);

    const memoizedChangeText = useCallback((text) => {
        passwordPopUp.current.setAllValues((prev: any) => {
            return {
                ...prev,
                password: text
            };
        });
    }, []);

    async function handleSubmit(item: any) {
        try {
            await addUserToJoinedGroupDB(item, user);
            await saveJoinedUser(item, user);

            await dispatchContextApp(
                {
                    type: 'set_new_group',
                    value: {
                        group: Object.assign(item, {
                            group_songs: item.group_songs || []
                        })
                    }
                });
            await dispatchContextSongs({ type: 'reset_all' });
            return navigation.goBack();
        } catch (error) {
            console.error(error.name, error.message);
        }
    }

    function handleGroupPassword(item: any) {
        return modalRef.current.setAllValues((prev: any) => {
            return {
                ...prev,
                isVisible: true,
                element: () => <ShowPopUpPasswordGroup
                    ref={passwordPopUp}
                    item={item}
                    handleChangeText={memoizedChangeText}
                    handleSubmit={async () => {
                        passwordPopUp.current.setAllValues((prevState: any) => ({ ...prevState, isLoading: true }));
                        await handleSubmit(item);
                        modalRef.current.setAllValues((prevState: any) => ({ ...prevState, isVisible: false }));
                        passwordPopUp.current.setAllValues((prevState: any) => ({ ...prevState, isLoading: false }));
                    }}
                />
            };
        });
    }

    function resetSearchingScreen() {
        setAllValues(prevValues => {
            return {
                ...prevValues,
                searchedGroups: [],
                isLoading: true
            };
        });
        source.cancel('SearchGroupsScreen Component got unmounted');
        navigation.goBack();
        return Promise.resolve(true);
    }

    if (allValues.isLoading) {
        return (
            <BodyContainer>
                {renderBackButton()}
                <PreLoader
                    containerStyle={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    size={50}
                />
            </BodyContainer>
        );
    }

    function renderBackButton() {
        return (
            <Icon
                containerStyle={{ position: 'absolute', top: 5, left: 10, zIndex: 100 }}
                onPress={resetSearchingScreen}
                name={'arrow-back'}
                type={'Ionicons'}
                size={25}
                color='#dd0031'
            />
        );
    }

    return (
        <BodyContainer>
            <CustomModal
                ref={modalRef}
                onBackdropPress={() => modalRef.current.setAllValues((prev: any) => ({ ...prev, isVisible: false }))}
            />
            <CommonFlatList
                style={{ marginTop: 10 }}
                emptyListComponent={<GroupEmpty />}
                data={allValues.searchedGroups}
                action={memoizedItem}
                keyExtractor={keyExtractor}
            />
            <AddGroupIcon />
        </BodyContainer>
    );
};

export default memo(SearchGroupsScreen);
