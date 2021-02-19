/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { useState, useEffect, memo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, Keyboard, Text } from 'react-native';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { TracksListContainer } from '../../common/TracksListContainer';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import { SearchingList } from './SearchingList';
import { MediaActions } from '../functional-components/MediaActions';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { AbstractMedia } from '../../common/functional-components/AbstractMedia';

function setMediaIndex(song, index?) {
    Object.assign(song, {
        index
    });
}

function hasSongOrGroupOwner(abstractMediaUser, songUser, groupOwner) {
    return ((abstractMediaUser && songUser.uid === abstractMediaUser.uid) ||
        abstractMediaUser.uid === groupOwner);
}

function setChatRoomName(group) {
    if (group.group_name && group.group_id) {
        return `${group.group_name}-${group.group_id}`;
    }
    return 'Moodem';
}

export const Songs = memo((props) => {
    const isFocused = useIsFocused();
    const [songs = [], setSongs] = useState([]);
    const [items = [], setItems] = useState([]);
    const [isSearching = false, setIsSearching] = useState(false);
    const abstractMedia = new AbstractMedia(props);
    const mediaBuilder = abstractMedia.mediaBuilder;

    useEffect(() => {
        console.log('2. Songs');
        mediaBuilder.msgFromServer(abstractMedia.socket, (_songs) => {
            _songs.forEach(setMediaIndex);
            setSongs([..._songs]);
        });
        mediaBuilder.msgToServer(abstractMedia.socket, 'send-message-media', { song: true, chatRoom: setChatRoomName(props.route.params.group) });
        return () => {
            console.log('2. OFF EFFECT Songs');
            abstractMedia.destroy();
        };
    }, []);

    const sendMediaToServer = (song) => {
        setSongs([]);
        setIsSearching(false);

        Object.assign(song, {
            isMediaOnList: true
        });

        abstractMedia.handleMediaActions('send-message-media', { song, chatRoom: setChatRoomName(props.route.params.group) });
    };

    const renderItem = (song) => (
        <CommonFlatListItem
            contentContainerStyle={{ position: 'relative' }}
            bottomDivider
            title={song.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={song.user && song.user.username}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            buttonGroup={{
                buttons: [
                    {
                        element: () => (<MediaActions
                            disabled={song.voted_users && song.voted_users.some(id => id === abstractMedia.user.uid)}
                            text={song.votes_count}
                            iconName={'thumbs-up'}
                            iconType={'entypo'}
                            iconColor={'#90c520'}
                            action={() => abstractMedia.handleMediaActions('send-message-vote', { song, chatRoom: setChatRoomName(props.route.params.group), user_id: abstractMedia.user.uid, count: ++song.votes_count })}
                        />)
                    },
                    // {
                    //     element: () => (<MediaActions
                    //         text={song.boosts_count}
                    //         iconName={'thunder-cloud'}
                    //         iconType={'entypo'}
                    //         iconColor={'#00b7e0'}
                    //     />)
                    // },
                    hasSongOrGroupOwner(abstractMedia.user, song.user, props.route.params.group.user_owner_id) && {
                        element: () => (<MediaActions
                            iconName={'remove'}
                            iconType={'font-awesome'}
                            iconColor={'#dd0031'}
                            action={() => abstractMedia.handleMediaActions('send-message-remove', { song, chatRoom: setChatRoomName(props.route.params.group), user_id: abstractMedia.user.uid })}
                        />)
                    }],
                containerStyle: { position: 'absolute', borderWidth: 0, right: 0, bottom: 0 },
                innerBorderStyle: { color: 'transparent' }
            }}
            checkmark={isSearching && song.isMediaOnList}
            action={() => abstractMedia.playerRef.current.dispatchActionsPressedTrack(song)}
        />
    );

    const onEndEditingSearch = (text) => mediaBuilder.getData(`${mediaBuilder.getApi()}${text}&client_id=`, 'soundcloud', abstractMedia.signal.token)
        .then(_items => {
            const filteredSongs = filterCleanData(_items, abstractMedia.user);
            mediaBuilder.checkIfAlreadyOnList(songs, filteredSongs);
            setIsSearching(!!filteredSongs.length);
            setItems([...filteredSongs]);
        })
        .catch(err => {
            if (abstractMedia.axios.isCancel(err)) {
                throw new Error('Search Songs Request Canceled Axios', err);
            }
            throw new Error('Error Songs Search', err);
        });

    const resetSearch = () => {
        abstractMedia.searchRef.current.clear();
        abstractMedia.searchRef.current.blur();
        setIsSearching(false);
        Keyboard.dismiss();
    };

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }} onStartShouldSetResponder={resetSearch}>
            <BurgerMenuIcon
                action={() => {
                    resetSearch();
                    abstractMedia.navigation.openDrawer();
                }}
                customStyle={{ top: -5, left: 0, width: 30, height: 30 }}
            />
            <CommonTopSearchBar
                placeholder="Search song..."
                cancelSearch={() => setIsSearching(false)}
                onEndEditingSearch={onEndEditingSearch}
                searchRef={abstractMedia.searchRef}
                customStyleContainer={{ width: '85%', marginLeft: 55 }}
            />
            <PlayerContainer>
                <Player ref={abstractMedia.playerRef} tracks={songs} />
            </PlayerContainer>
            <TracksListContainer>
                {isSearching ?
                    <SearchingList player={abstractMedia.playerRef} handler={sendMediaToServer} items={items} /> :
                    <CommonFlatList
                        emptyListComponent={MediaListEmpty}
                        data={songs}
                        action={({ item }) => renderItem(item)}
                    />
                }
            </TracksListContainer>
        </View>
    );
});
