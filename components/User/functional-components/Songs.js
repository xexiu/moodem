/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { useState, useEffect, useContext, memo } from 'react';
import axios from 'axios';
import { View } from 'react-native';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import {
    checkIfAlreadyOnList,
    getData,
    MediaBuilder
} from '../../../src/js/Utils/Helpers/actions/common';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { TracksListContainer } from '../../common/TracksListContainer';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import { UserContext } from '../../User/functional-components/UserContext';
import { MediaActions } from '../functional-components/MediaActions';

const setMediaList = (setSongs) => songsList => {
    console.log('Blkaaaa', songsList);
    setSongs([...songsList]);
};

export const Songs = memo((props) => {
    const { navigation } = props;
    const { user } = useContext(UserContext);
    const [songs = [], setSongs] = useState([]);
    const [searchedTracksList = [], setSearchedTracksList] = useState([]);
    const [isSearchingTracks = false, setIsSearchingTracks] = useState(false);
    const songsList = isSearchingTracks ? searchedTracksList : songs;
    const media = new MediaBuilder();
    const socket = media.socket();
    const playerRef = media.playerRef();
    const signal = axios.CancelToken.source();
    media.setApi('https://api.soundcloud.com/tracks/?limit=50&q=');

    useEffect(() => {
        console.log('On useEffect Songs');
        media.msgFromServer(socket, setMediaList(setSongs));
        media.msgToServer(socket, 'send-message-media', { song: true, chatRoom: 'global-moodem-songsPlaylist' });

        return () => {
            console.log('Off useEffect Songs');
            axios.Cancel();
            socket.emit('disconnect');
            socket.off(media.msgFromServer);
            socket.close();
        };
    }, [songs.length]);

    const cancelSearch = () => {
        setSearchedTracksList([]);
        setIsSearchingTracks(false);
    };

    const sendSongToList = (song) => {
        setSearchedTracksList([]);
        setIsSearchingTracks(false);

        Object.assign(song, {
            isMediaOnList: true,
            index: songs.length
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
            chevron={isSearchingTracks && !song.isMediaOnList && {
                color: '#dd0031',
                onPress: () => sendSongToList(song),
                size: 10,
                raised: true,
                iconStyle: { fontSize: 15, paddingLeft: 2 },
                containerStyle: { marginRight: -10 }
            }}
            buttonGroup={!isSearchingTracks ? {
                buttons: [{
                    element: () => (<MediaActions
                        disabled={song.voted_users.some(id => id === user.uid)}
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
            } : null}
            checkmark={isSearchingTracks && song.isMediaOnList}
            action={() => playerRef.current.handlingTrackedPressed(isSearchingTracks, song)}
        />
    );

    const handlingOnPressSearch = (searchedTracks) => {
        checkIfAlreadyOnList(songs, searchedTracks);
        setSearchedTracksList(searchedTracks);
        setIsSearchingTracks(!!searchedTracks.length);
    };

    const onEndEditingSearch = (text) => getData(`${media.getApi()}${text}&client_id=`, 'soundcloud', signal.token)
        .then(data => handlingOnPressSearch(filterCleanData(data, user)))
        .catch(err => {
            if (axios.isCancel(err)) {
                console.log('post Request canceled');
            }
            console.log('Error', err);
        });

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <CommonTopSearchBar placeholder="Search song..." onEndEditingSearch={onEndEditingSearch} cancelSearch={cancelSearch} />
            <PlayerContainer>
                <Player ref={playerRef} tracks={songsList} />
            </PlayerContainer>
            <TracksListContainer>
                <CommonFlatList
                    emptyListComponent={MediaListEmpty}
                    data={songsList}
                    action={({ item }) => renderItem(item)}
                />
            </TracksListContainer>
        </View>
    );
});
