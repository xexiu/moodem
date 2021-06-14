import React, { memo, useCallback, useContext } from 'react';
import { View } from 'react-native';
import { GroupEmpty } from '../../../screens/User/functional-components/GroupEmpty';
import { USER_AVATAR_DEFAULT } from '../../../src/js/Utils/constants/users';
import CommonFlatList from '../../common/functional-components/CommonFlatList';
import CommonFlatListItem from '../../common/functional-components/CommonFlatListItem';
import { AppContext } from '../store-context/AppContext';
import { GroupSongsIcon } from './GroupSongsIcon';
import { GroupUsersIcon } from './GroupUsersIcon';

const MyGroupsSceneTab = ({ navigation }: any) => {
    console.log('My Groups');
    const { groups, dispatchContextApp } = useContext(AppContext) as any;
    const keyExtractor = useCallback((item: any) => item.group_id, []);
    const memoizedItem = useCallback(({ item }) => {
        return (
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
                    subtitle={'herhehrerhehrre'}
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
                        dispatchContextApp({ type: 'group', value: item });
                        navigation.openDrawer();
                    }}
                />
                <GroupUsersIcon users={item.group_users} />
                <GroupSongsIcon songs={item.group_songs} />
            </View>
        );
    }, []);

    return (
        <CommonFlatList
            style={{ marginTop: 10 }}
            emptyListComponent={GroupEmpty}
            data={groups}
            action={memoizedItem}
            keyExtractor={keyExtractor}
        />
    );
};

export default memo(MyGroupsSceneTab);
