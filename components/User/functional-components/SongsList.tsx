import React, { memo, useContext } from 'react';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { AppContext } from '../../User/functional-components/AppContext';
import { ButtonsMedia } from './ButtonsMedia';

function hasSongOrGroupOwner(mediaUser: any, songUser: any, groupOwner: any) {
    return ((mediaUser && songUser.uid === mediaUser.uid) ||
        mediaUser.uid === groupOwner);
}

const SongsList = (props: any) => {
    const { group } = useContext(AppContext) as any;
    const {
        items,
        media,
        handler,
        isSearching
    } = props;

    const renderItemWithSongs = (song: any) => (
        <CommonFlatListItem
            contentContainerStyle={{ position: 'relative' }}
            bottomDivider
            title={song.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={song.user && song.user.username}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            leftAvatar={{
                source: { uri: song.artwork_url }
            }}
            buttonGroup={
            [
                {
                    element: () => (
                            <ButtonsMedia
                                containerStyle={{ paddingRight: 2 }}
                                disabled={
                                    song.voted_users && song.voted_users.some((id: number) => id === media.user.uid
                                    )}
                                text={song.votes_count}
                                iconName={'thumbs-up'}
                                iconType={'entypo'}
                                iconColor={'#90c520'}
                                action={() => {
                                    console.log('PRESSED VOTE');
                                    media.emit('send-message-vote-up',
                                        {
                                            song,
                                            chatRoom: group.group_name,
                                            user_id: media.user.uid,
                                            count: ++song.votes_count
                                        });
                                }}
                            />
                        )
                },
                hasSongOrGroupOwner(media.user, song.user, group.user_owner_id) && {
                    element: () => (
                            <ButtonsMedia
                                containerStyle={{ position: 'relative', paddingRight: 2, marginLeft: 10 }}
                                iconName={'remove'}
                                iconType={'font-awesome'}
                                iconColor={'#dd0031'}
                                action={() => {
                                    console.log('PRESSED REMOVE');
                                    media.emit('send-message-remove-song',
                                        {
                                            song,
                                            chatRoom: group.group_name,
                                            user_id: media.user.uid
                                        });
                                }}
                            />
                        )
                }]
            }
            checkmark={isSearching && song.isMediaOnList}
            action={() => {
                return media.playerRef.current.dispatchActionsPressedTrack(song);
            }}
        />
    );

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
                return media.playerRef.current.dispatchActionsPressedTrack(item);
            }}
        />
    );

    if (isSearching) {
        return (
            <CommonFlatList
                headerComponent={(
                    <PlayerContainer items={items}>
                        <Player ref={media.playerRef} tracks={items} />
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
                    <Player ref={media.playerRef} tracks={items} />
                </PlayerContainer>
            )}
            data={items}
            extraData={items}
            action={({ item }) => renderItemWithSongs(item)}
        />
    );
};

memo(SongsList);

export { SongsList };
