import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import CommonFlatList from '../../../components/common/functional-components/CommonFlatList';
import CommonFlatListItem from '../../../components/common/functional-components/CommonFlatListItem';
import CustomModal from '../../../components/common/functional-components/CustomModal';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import AddGroupIcon from '../../../components/User/functional-components/AddGroupIcon';
import { GroupEmpty } from '../../../components/User/functional-components/GroupEmpty';
import { GroupPrivateIcon } from '../../../components/User/functional-components/GroupPrivateIcon';
import { GroupSongsIcon } from '../../../components/User/functional-components/GroupSongsIcon';
import { GroupUsersIcon } from '../../../components/User/functional-components/GroupUsersIcon';
import ShowPopUpPasswordGroup from '../../../components/User/functional-components/ShowPopUpPasswordGroup';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { SongsContext } from '../../../components/User/store-context/SongsContext';
import { USER_AVATAR_DEFAULT } from '../../../src/js/Utils/constants/users';
import {
    addUserToJoinedGroupDB,
    filterSearchedGroups,
    filterSearchedPrivateGroups,
    filterSearchedPublicGroups,
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
        searchAllGroups: filterSearchedGroups,
        searchPublicGroups: filterSearchedPublicGroups,
        searchPrivateGroups: filterSearchedPrivateGroups
    } as any;

    async function fetchResults() {
        try {
            const allGroups = await getAllGroups();
            const filteredGroups = allGroups.filter((group: any) => {
                if (filter && Object.keys(filter).length) {
                    return MAP_FILTERS[Object.keys(filter) as any](group, searchedText, user);
                }
                return group.group_name.indexOf(searchedText) >= 0;
            });
            return Promise.resolve(filteredGroups);
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
        fetchResults()
            .then((filteredGroups: any) => {
                navigation.setOptions({ title: `${filteredGroups.length} encontrado(s)` });
                setAllValues(prev => {
                    return {
                        ...prev,
                        searchedGroups: [...filteredGroups],
                        isLoading: false
                    };
                });
            });
        return () => {
            source.cancel('SearchGroupsScreen Component got unmounted');
        };
    }, []);

    const keyExtractor = useCallback((item: any) => item.group_id, []);
    const memoizedItem = useCallback(({ item }) => (
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
            buttonGroup={[
                {
                    element: () => <GroupUsersIcon users={item.group_users} />
                },
                {
                    element: () => <GroupSongsIcon songs={item.group_songs} />
                },
                {
                    element: () => <GroupPrivateIcon group={item} />
                }
            ]}
            action={() => {
                if (item.group_password) {
                    return handleGroupPassword(item);
                }
                setAllValues(prevState => {
                    return {
                        ...prevState,
                        isLoading: true
                    };
                });
                return handleSubmit(item);
            }}
        />
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
                        setAllValues(prevState => {
                            return {
                                ...prevState,
                                isLoading: true
                            };
                        });
                        await handleSubmit(item);
                        modalRef.current.setAllValues((prevState: any) => ({ ...prevState, isVisible: false }));
                        passwordPopUp.current.setAllValues((prevState: any) => ({ ...prevState, isLoading: false }));
                    }}
                />
            };
        });
    }

    if (allValues.isLoading) {
        return (
            <BodyContainer>
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
