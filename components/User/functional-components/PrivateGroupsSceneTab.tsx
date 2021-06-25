import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useContext } from 'react';
import { Text, View } from 'react-native';
import { DEFAULT_GROUP_AVATAR } from '../../../src/js/Utils/constants/groups';
import { leaveGroup } from '../../../src/js/Utils/Helpers/actions/groups';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import CommonFlatList from '../../common/functional-components/CommonFlatList';
import CommonFlatListItem from '../../common/functional-components/CommonFlatListItem';
import CommonTopSearchBar from '../../common/functional-components/CommonTopSearchBar';
import { MediaListEmpty } from '../../User/functional-components/MediaListEmpty';
import { AppContext } from '../store-context/AppContext';
import { SongsContext } from '../store-context/SongsContext';
import { GroupPrivateIcon } from './GroupPrivateIcon';
import { GroupSongsIcon } from './GroupSongsIcon';
import { GroupUsersIcon } from './GroupUsersIcon';
import { LeaveGroupIcon } from './LeaveGroupIcon';

const PrivateGroupsSceneTab = () => {
    const { groups, user, dispatchContextApp } = useContext(AppContext) as any;
    const { dispatchContextSongs } = useContext(SongsContext) as any;
    const navigation = useNavigation<any>();
    const privateGroups = groups.filter((group: any) => {
        return !!group.group_password && group.group_user_owner_id !== user.uid;
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
                        uri: DEFAULT_GROUP_AVATAR
                    }
                }}
                subTitleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
                subtitle={item.group_description}
                chevron={item.group_user_owner_id !== user.uid &&
                    item.group_name !== 'Moodem' && LeaveGroupIcon(item, async () => {
                        await leaveGroup(item, user);
                        await dispatchContextApp(
                            {
                                type: 'delete_owned_group',
                                value: {
                                    group: item
                                }
                            });
                    })}
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
                    navigation.openDrawer();
                }}
            />
        </View>
    ), []);

    function gruopsLengthMsg() {
        if (!privateGroups.length) {
            return null;
        }
        let msg = '';
        privateGroups.length === 1 ?
        msg = `${translate('groups.msgPrivateGroups.0')} ${privateGroups.length} ${translate('groups.msgPrivateGroups.1')}` :
        msg = `${translate('groups.msgPrivateGroups.2')} ${privateGroups.length} ${translate('groups.msgPrivateGroups.3')}`;

        return (
            <View style={{ alignItems: 'center', marginBottom: 10 }}><Text style={{ color: '#666' }}>{msg}</Text></View>
        );
    }

    function handleEndSearch(searchedText: string) {
        return navigation.navigate('SearchGroupsScreen', {
            searchedText,
            filter: {
                searchPrivateGroups: true
            }
        });
    }

    return (
        <View>
            <CommonTopSearchBar
                customStyleContainer={{ marginLeft: 0 }}
                placeholder={translate('groups.searchBar.placeholderPrivateGroups')}
                cancelSearch={() => {
                }}
                onEndEditingSearch={handleEndSearch}
            />
            <CommonFlatList
                style={{ marginTop: 10 }}
                emptyListComponent={<MediaListEmpty msg={translate('groups.msgPrivateGroups.4')} />}
                headerComponent={gruopsLengthMsg()}
                data={privateGroups}
                action={memoizedItem}
                keyExtractor={keyExtractor}
            />
        </View>
    );
};

export default memo(PrivateGroupsSceneTab);
