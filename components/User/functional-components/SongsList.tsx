import React, { memo } from 'react';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { MediaButtons } from './MediaButtons';

const SongsList = (props: any) => {
    const {
        media,
        handler,
        group,
        items,
        isSearching,
        player
    } = props;

    console.log('4. SongsList');

    const renderItem = (song: any) => (
        <CommonFlatListItem
            contentContainerStyle={{
                position: 'relative',
                paddingTop: 5,
                paddingBottom: 20,
                paddingLeft: 0,
                paddingRight: 0
            }}
            bottomDivider
            title={song.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={song.user && song.user.username}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            leftAvatar={{
                source: { uri: song.artwork_url }
            }}
            buttonGroup={isSearching ? [] : MediaButtons(song, media, group, ['votes', 'remove'])}
            chevron={!song.isMediaOnList && {
                name: 'arrow-right',
                type: 'AntDesign',
                color: '#dd0031',
                onPress: () => handler(song),
                size: 10,
                raised: true,
                iconStyle: { fontSize: 27, alignSelf: 'center' },
                containerStyle: { marginLeft: 0 }
            }}
            action={() => {
                return player.current.dispatchActionsPressedTrack(song);
            }}
        />
    );

    if (isSearching) {
        return (
            <CommonFlatList
                headerComponent={(
                    <PlayerContainer items={items}>
                        <Player ref={player} tracks={items} />
                    </PlayerContainer>
                )}
                data={items}
                extraData={items}
                action={({ item }) => renderItem(item)}
            />
        );
    }

    return (
        <CommonFlatList
            headerComponent={(
                <PlayerContainer items={items}>
                    <Player ref={player} tracks={items} />
                </PlayerContainer>
            )}
            data={items}
            extraData={items}
            action={({ item }) => renderItem(item)}
        />
    );
};

memo(SongsList);

export { SongsList };
