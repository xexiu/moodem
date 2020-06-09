/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { useState, useEffect, useRef, useContext, memo } from 'react';
import axios from 'axios';
import { View, Keyboard } from 'react-native';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import { MediaBuilder } from '../../../src/js/Utils/Helpers/actions/common';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { TracksListContainer } from '../../common/TracksListContainer';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import { UserContext } from '../../User/functional-components/UserContext';
import { SearchingList } from './SearchingList';
import { MediaActions } from '../functional-components/MediaActions';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';

const setMediaIndex = (song, index) => {
    Object.assign(song, {
        index
    });
};

export const Songs = memo((props) => {
    const { navigation } = props;
    const { user } = useContext(UserContext);
    const [songs = [], setSongs] = useState([]);
    const [items = [], setItems] = useState([]);
    const [isSearching = false, setIsSearching] = useState(false);
    const media = new MediaBuilder();
    const socket = media.socket();
    const playerRef = media.playerRef();
    const signal = axios.CancelToken.source();
    const searchRef = useRef(null);
    media.setApi('https://api.soundcloud.com/tracks/?limit=50&q=');

    useEffect(() => {
        console.log('On useEffect Songs');
        media.msgFromServer(socket, (_songs) => {
            _songs.forEach(setMediaIndex);
            setSongs([..._songs]);
        });
        media.msgToServer(socket, 'send-message-media', { song: true, chatRoom: 'global-moodem-songsPlaylist' });

        return () => {
            console.log('Off useEffect Songs');
            axios.Cancel();
            socket.emit('disconnect');
            socket.off(media.msgFromServer);
            socket.close();
        };
    }, []);

    const sendMediaToServer = (song) => {
        setSongs([]);
        setIsSearching(false);

        Object.assign(song, {
            isMediaOnList: true
        });

        media.msgToServer(socket, 'send-message-media', { song, chatRoom: 'global-moodem-songsPlaylist' });
    };

    const handleSongActions = (song, count, actionName) => {
        if (user && actionName === 'vote') {
            socket.emit(`send-message-${actionName}`, { song, chatRoom: 'global-moodem-songsPlaylist', user_id: user.uid, songId: song.id, count });
        } else if (user && !song.hasBoosted && actionName === 'boost') {
            socket.emit(`send-message-${actionName}`, { song, chatRoom: 'global-moodem-songsPlaylist', songId: song.id, count });
        } else if (user && !song.hasBoosted && actionName === 'remove') {
            socket.emit(`send-message-${actionName}`, { song, chatRoom: 'global-moodem-songsPlaylist', songId: song.id });
        } else if (!user) {
            navigation.navigate('Guest');
        }
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
                        disabled={song.voted_users && song.voted_users.some(id => id === user.uid)}
                        text={song.votes_count}
                        iconName={'thumbs-up'}
                        iconType={'entypo'}
                        iconColor={'#90c520'}
                        action={() => handleSongActions(song, ++song.votes_count, 'vote')}
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
                user && !!song.user && song.user.uid === user.uid && {
                    element: () => (<MediaActions
                        iconName={'remove'}
                        iconType={'font-awesome'}
                        iconColor={'#dd0031'}
                        action={() => handleSongActions(song, null, 'remove')}
                    />)
                }],
                containerStyle: { position: 'absolute', borderWidth: 0, right: 0, bottom: 0 },
                innerBorderStyle: { color: 'transparent' }
            }}
            checkmark={isSearching && song.isMediaOnList}
            action={() => playerRef.current.dispatchActionsPressedTrack(song)}
        />
    );

    const onEndEditingSearch = (text) => media.getData(`${media.getApi()}${text}&client_id=`, 'soundcloud', signal.token)
        .then(_items => {
            const filteredSongs = filterCleanData(_items, user);
            media.checkIfAlreadyOnList(songs, filteredSongs);
            setIsSearching(!!filteredSongs.length);
            setItems([...filteredSongs]);
        })
        .catch(err => {
            if (axios.isCancel(err)) {
                console.log('post Request canceled');
            }
            console.log('Error', err);
        });

    const resetSearch = () => {
        searchRef.current.clear();
        searchRef.current.blur();
        setIsSearching(false);
        Keyboard.dismiss();
    };

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }} onStartShouldSetResponder={resetSearch}>
            <BurgerMenuIcon
                action={() => {
                    resetSearch();
                    navigation.openDrawer();
                }}
                customStyle={{ top: -5, left: 0, width: 30, height: 30 }}
            />
            <CommonTopSearchBar
                placeholder="Search song..."
                cancelSearch={() => setIsSearching(false)}
                onEndEditingSearch={onEndEditingSearch}
                searchRef={searchRef}
                customStyleContainer={{ width: '85%', marginLeft: 55 }}
            />
            <PlayerContainer>
                <Player ref={playerRef} tracks={songs} />
            </PlayerContainer>
            <TracksListContainer>
                {isSearching ?
                    <SearchingList player={playerRef} sendMediaToServer={sendMediaToServer} items={items} /> :
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
