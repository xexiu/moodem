import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useContext } from 'react';
import { Text, View } from 'react-native';
import { GroupEmpty } from '../../../screens/User/functional-components/GroupEmpty';
import { USER_AVATAR_DEFAULT } from '../../../src/js/Utils/constants/users';
import CommonFlatList from '../../common/functional-components/CommonFlatList';
import CommonFlatListItem from '../../common/functional-components/CommonFlatListItem';
import CommonTopSearchBar from '../../common/functional-components/CommonTopSearchBar';
import { AppContext } from '../store-context/AppContext';
import { SongsContext } from '../store-context/SongsContext';
import { GroupSongsIcon } from './GroupSongsIcon';
import { GroupUsersIcon } from './GroupUsersIcon';

const PublicGroupsSceneTab = () => {
    const { groups, user, dispatchContextApp } = useContext(AppContext) as any;
    const { dispatchContextSongs } = useContext(SongsContext) as any;
    const navigation = useNavigation<any>();
    const publicGroups = groups.filter((group: any) => {
        return !group.group_password && group.group_user_owner_id !== user.uid;
    });
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
                action={async () => {
                    await dispatchContextApp(
                        {
                            type: 'set_current_group',
                            value: {
                                group: Object.assign(item, {
                                    group_songs: item.group_songs || []
                                })
                            }
                        });
                    await dispatchContextSongs({ type: 'reset_all' });
                    return navigation.openDrawer();
                }}
            />
            <GroupUsersIcon users={item.group_users} />
            <GroupSongsIcon songs={item.group_songs} />
        </View>
    ), []);

    function gruopsLengthMsg() {
        if (!publicGroups.length) {
            return null;
        }
        let msg = '';
        publicGroups.length === 1 ?
            msg = `Te has unido a ${publicGroups.length} grupo.` :
            msg = `Te has unido a ${publicGroups.length} grupos`;

        return (
            <View style={{ alignItems: 'center', marginBottom: 10 }}><Text style={{ color: '#666' }}>{msg}</Text></View>
        );
    }

    function handleEndSearch(searchedText: string) {
        return navigation.navigate('SearchGroupsScreen', {
            searchedText,
            filter: {
                searchPublicGroups: true
            }
        });
    }

    return (
        <View>
            <CommonTopSearchBar
                customStyleContainer={{ marginLeft: 0 }}
                placeholder='Buscar grupos públicos...'
                cancelSearch={() => {
                    console.log('Search Cancel')
                }}
                onEndEditingSearch={handleEndSearch}
            />
            <CommonFlatList
                style={{ marginTop: 10 }}
                emptyListComponent={<GroupEmpty msg={'Te has unido a 0 grupos públicos!'} />}
                headerComponent={gruopsLengthMsg()}
                data={publicGroups}
                action={memoizedItem}
                keyExtractor={keyExtractor}
            />
        </View>
    );
};

export default memo(PublicGroupsSceneTab);
