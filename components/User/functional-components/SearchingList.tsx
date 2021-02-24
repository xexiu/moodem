import React, { memo } from 'react';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';


const SearchingList = (props: any) => {
    const {
        items,
        player,
        handler
    } = props;

    const renderItem = (item: any) => (
        <CommonFlatListItem
            contentContainerStyle={{ position: 'relative' }}
            topDivider={false}
            bottomDivider={true}
            title={item.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={item.user && item.user.username}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            leftAvatar={{
                source: { uri: item.artwork_url }
            }}
            chevron={!item.isMediaOnList && {
                name: 'arrow-right',
                type: 'AntDesign',
                color: '#dd0031',
                onPress: () => handler(item),
                size: 10,
                raised: true,
                iconStyle: { fontSize: 27, alignSelf: 'center' },
                containerStyle: { marginLeft: 0 }
            }}
            action={() => {
                return player.current.dispatchActionsPressedTrack(item);
            }}
        />
    );

    return (
        <CommonFlatList
            data={items}
            action={({ item }) => renderItem(item)}
        />
    );
};

memo(SearchingList);

export { SearchingList };
