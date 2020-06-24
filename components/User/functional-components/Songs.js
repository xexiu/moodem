/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { useState, useEffect, memo } from 'react';
import { View, Keyboard } from 'react-native';
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

const SOUNDCLOUD_API = 'https://api.soundcloud.com/tracks/?limit=50&q=';

const setMediaIndex = (song, index) => {
    Object.assign(song, {
        index
    });
};

export const Songs = memo((props) => {
    const [songs = [], setSongs] = useState([]);
    const [items = [], setItems] = useState([]);
    const [isSearching = false, setIsSearching] = useState(false);
    const abstractMedia = new AbstractMedia(props, SOUNDCLOUD_API);
    const mediaBuilder = abstractMedia.mediaBuilder;

    useEffect(() => {
        console.log('On useEffect Songs');
        mediaBuilder.msgFromServer(abstractMedia.socket, (_songs) => {
            _songs.forEach(setMediaIndex);
            setSongs([..._songs]);
        });
        mediaBuilder.msgToServer(abstractMedia.socket, 'send-message-media', { song: true, chatRoom: 'global-moodem-songPlaylist' });

        return () => {
            console.log('Off useEffect Songs');
            abstractMedia.destroy();
        };
    }, []);

    const sendMediaToServer = (song) => {
        setSongs([]);
        setIsSearching(false);

        Object.assign(song, {
            isMediaOnList: true
        });

        mediaBuilder.msgToServer(abstractMedia.socket, 'send-message-media', { song, chatRoom: 'global-moodem-songPlaylist' });
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
                buttons: [{
                    element: () => (<MediaActions
                        disabled={song.voted_users && song.voted_users.some(id => id === abstractMedia.user.uid)}
                        text={song.votes_count}
                        iconName={'thumbs-up'}
                        iconType={'entypo'}
                        iconColor={'#90c520'}
                        action={() => abstractMedia.handleMediaActions('send-message-vote', { song, chatRoom: 'global-moodem-songPlaylist', user_id: abstractMedia.user.uid, count: ++song.votes_count })}
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
                abstractMedia.user && !!song.user && song.user.uid === abstractMedia.user.uid && {
                    element: () => (<MediaActions
                        iconName={'remove'}
                        iconType={'font-awesome'}
                        iconColor={'#dd0031'}
                        action={() => abstractMedia.handleMediaActions('send-message-remove', { song, chatRoom: 'global-moodem-songPlaylist', user_id: abstractMedia.user.uid })}
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
                console.log('Search Songs Request Canceled');
            }
            console.log('Error', err);
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
