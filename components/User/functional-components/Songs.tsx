/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { memo, useEffect, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { AbstractMedia } from '../../common/functional-components/AbstractMedia';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { ButtonsMedia } from './ButtonsMedia';
import { SearchingList } from './SearchingList';

function setMediaIndex(song: any, index) {
    Object.assign(song, {
        index
    });
}

function hasSongOrGroupOwner(mediaUser: any, songUser: any, groupOwner: any) {
    return ((mediaUser && songUser.uid === mediaUser.uid) ||
    mediaUser.uid === groupOwner);
}

function setChatRoomName(group: any) {
    if (group.group_name && group.group_id) {
        return `${group.group_name}-${group.group_id}`;
    }
    return 'Moodem';
}

export const Songs = memo((props: any) => {
    const [songs, setSongs] = useState([]);
    const [items, setItems] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const media = new AbstractMedia(props);

    useEffect(() => {
        console.log('2. Songs');
        media.on('send-message-media', (_songs: any) => {
            _songs.forEach(setMediaIndex);
            setSongs([..._songs]);
        });
        media.emit('send-message-media', { chatRoom: setChatRoomName(props.route.params.group) });
        return () => {
            console.log('2. OFF EFFECT Songs');
            media.destroy();
        };
    }, []);

    const sendMediaToServer = (song: object) => {
        setSongs([]);
        setIsSearching(false);

        media.emit('send-message-media',
            { song, chatRoom: setChatRoomName(props.route.params.group) });
    };

    const renderItem = (song) => (
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
                    element: () => (<ButtonsMedia
                            containerStyle={{ paddingRight: 2 }}
                            disabled={song.voted_users && song.voted_users.some(id => id === media.user.uid)}
                            text={song.votes_count}
                            iconName={'thumbs-up'}
                            iconType={'entypo'}
                            iconColor={'#90c520'}
                            action={() => {
                                console.log('PRESSED VOTE');
                                media.emit('send-message-vote',
                                { song, chatRoom: setChatRoomName(props.route.params.group), user_id: abstractMedia.user.uid, count: ++song.votes_count });
                            }}
                        />)
                },
                hasSongOrGroupOwner(abstractMedia.user, song.user, props.route.params.group.user_owner_id) && {
                    element: () => (<ButtonsMedia
                            containerStyle={{ position: 'relative', paddingRight: 2, marginLeft: 10 }}
                            iconName={'remove'}
                            iconType={'font-awesome'}
                            iconColor={'#dd0031'}
                            action={() => {
                                console.log('PRESSED REMOVE');
                                media.emit('send-message-remove',
                                { song, chatRoom: setChatRoomName(props.route.params.group), user_id: abstractMedia.user.uid });
                            }}
                        />)
                }]
            }
            checkmark={isSearching && song.isMediaOnList}
            action={() => {
                return media.playerRef.current.dispatchActionsPressedTrack(song);
            }}
        />
    );

    const onEndEditingSearch = (text: string) => {
        return media.getSongData({
            limit: 50,
            q: text
        }, 'soundcloud_api', 'soundcloud_key')
            .then((data => {
                const filteredSongs = filterCleanData(data, media.user);
                media.checkIfAlreadyOnList(songs, filteredSongs);
                setIsSearching(!!filteredSongs.length);
                setItems([...filteredSongs]);
            }))
            .catch(err => { });
    };

    const resetSearch = () => {
        media.searchRef.current.clear();
        media.searchRef.current.blur();
        setIsSearching(false);
        Keyboard.dismiss();
        return true;
    };

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <BurgerMenuIcon
                action={() => {
                    resetSearch();
                    media.navigation.openDrawer();
                }}
                customStyle={{ top: -5, left: 0, width: 30, height: 30 }}
            />
            <CommonTopSearchBar
                placeholder='Search song...'
                cancelSearch={() => setIsSearching(false)}
                onEndEditingSearch={onEndEditingSearch}
                searchRef={media.searchRef}
                customStyleContainer={{ width: '85%', marginLeft: 55 }}
            />
            <PlayerContainer>
                <Player ref={media.playerRef} tracks={isSearching ? items : songs} />
            </PlayerContainer>
            <View style={{ backgroundColor: '#fff', flex: 1 }} onStartShouldSetResponder={resetSearch}>
                {isSearching ?
                    <SearchingList player={media.playerRef} handler={sendMediaToServer} items={items} /> :
                    <CommonFlatList
                        emptyListComponent={MediaListEmpty}
                        data={songs}
                        action={({ item }) => renderItem(item)}
                    />
                }
            </View>
        </View>
    );
});
