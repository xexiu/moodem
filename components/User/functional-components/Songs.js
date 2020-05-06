/* eslint-disable max-len */
import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import Toast from 'react-native-easy-toast';
import axios from 'axios';
import { View, Text } from 'react-native';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { getSoundCloudData } from '../../../src/js/SoundCloud/soundCloudFetchers';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { TracksListContainer } from '../../common/TracksListContainer';
import { SongsListEmpty } from '../../../screens/User/functional-components/SongsListEmpty';
import { UserContext } from '../../User/functional-components/UserContext';

const messageFromServerWithTrack = (setTracksList) => tracksList => setTracksList([...tracksList]);

const checkSearchedTrackIfAlreadyOnTrackList = (tracksList, searchedTracks) => {
    tracksList.forEach(track => {
        searchedTracks.forEach(searchedTrack => {
            if (track.id === searchedTrack.id) {
                Object.assign(searchedTrack, {
                    isOnTracksList: true
                });
            }
        });
    });
};

const Songs = (props) => {
    const { navigation } = props;
    const { user } = useContext(UserContext);
    const [searchedTracksList = [], setSearchedTracksList] = useState([]);
    const [tracksList = [], setTracksList] = useState([]);
    const [isSearchingTracks = false, setIsSearchingTracks] = useState(false);
    const tracks = isSearchingTracks ? searchedTracksList : tracksList;
    const signal = axios.CancelToken.source();
    const socket = io('http://192.168.10.12:3000', { // Mobile --> http://172.20.10.9:3000
        transports: ['websocket'],
        jsonp: false,
        reconnectionAttempts: 'Infinity',
        timeout: 10000,
        'force new connection': true
    });
    const toastRef = React.createRef();
    const playerRef = React.createRef();

    useEffect(() => {
        socket.on('server-send-message-track', messageFromServerWithTrack(setTracksList));
        // socket.on('server-send-message-vote', this.messageFromServerWithVote.bind(this));
        // socket.on('server-send-message-boost', this.messageFromServerWithBoost.bind(this));
        socket.emit('join-global-playList-moodem', { chatRoom: 'global-playList-moodem', displayName: user.displayName || 'Guest' });
        socket.emit('send-message-track');

        return () => {
            axios.Cancel();
            socket.off(messageFromServerWithTrack);
            // socket.off(this.messageFromServerWithVote);
            // socket.off(this.messageFromServerWithBoost);
            socket.close();
        };
    }, [tracksList.length]);

    const sendSongToTrackList = (track) => {
        setSearchedTracksList([]);
        setIsSearchingTracks(false);

        Object.assign(track, {
            isOnTracksList: true,
            index: tracksList.length
        });

        socket.emit('send-message-track', track);
    };

    const renderItem = (song) => (
        <CommonFlatListItem
            bottomDivider
            title={song.title}
            subtitle={song.user && song.user.username}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            chevron={isSearchingTracks && !song.isOnTracksList && {
                color: '#dd0031',
                onPress: () => sendSongToTrackList(song),
                size: 10,
                raised: true,
                iconStyle: { fontSize: 15, paddingLeft: 2 },
                containerStyle: { marginRight: -10 }
            }}
            checkmark={isSearchingTracks && song.isOnTracksList}
            action={() => playerRef.current.handlingTrackedPressed(isSearchingTracks, song)}
        />
    );

    const handlingOnPressSearch = (searchedTracks) => {
        checkSearchedTrackIfAlreadyOnTrackList(tracksList, searchedTracks);
        setSearchedTracksList(searchedTracks);
        setIsSearchingTracks(!!searchedTracks.length);
    };

    const onEndEditingSearch = (text) => new Promise(resolve => {
        getSoundCloudData(text, signal)
            .then(data => {
                handlingOnPressSearch(filterCleanData(data, user));
                return resolve();
            })
            .catch(err => {
                if (axios.isCancel(err)) {
                    console.log('post Request canceled');
                }
                console.log('Error', err);
            });
    });

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <CommonTopSearchBar placeholder="Search song..." onEndEditingSearch={onEndEditingSearch} />
            <PlayerContainer>
                <Player ref={playerRef} tracks={tracks} />
                <Toast
                    position='top'
                    ref={toastRef}
                />
            </PlayerContainer>
            <TracksListContainer>
                <CommonFlatList
                    emptyListComponent={SongsListEmpty}
                    data={tracks}
                    action={({ item }) => renderItem(item)}
                />
            </TracksListContainer>
        </View>
    );
};

Songs.navigationOptions = ({ route }) => ({
    drawerIcon: ''
});

export {
    Songs
};
