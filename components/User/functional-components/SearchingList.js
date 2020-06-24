import React, { memo } from 'react';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';

export const SearchingList = memo((props) => {
    const {
        items,
        player,
        handler
    } = props;

    const renderItem = (item) => (
            <CommonFlatListItem
            contentContainerStyle={{ position: 'relative' }}
            bottomDivider
            title={item.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={item.user && item.user.username}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            chevron={!item.isMediaOnList && {
                color: '#dd0031',
                onPress: () => handler(item),
                size: 10,
                raised: true,
                iconStyle: { fontSize: 15, paddingLeft: 2 },
                containerStyle: { marginRight: -10 }
            }}
            checkmark={item.isMediaOnList}
            action={() => player.current.dispatchActionsPressedTrack(item)}
            />
        );

    return (
        <CommonFlatList
            data={items}
            action={({ item }) => renderItem(item)}
        />
    );
});
