/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import Toast from 'react-native-easy-toast';
import axios from 'axios';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import MediaAbstractor from '../../common/class-components/MediaAbstractor';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import { checkIfAlreadyOnList, getData } from '../../../src/js/Utils/Helpers/actions/common';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { TracksListContainer } from '../../common/TracksListContainer';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import { UserContext } from '../../User/functional-components/UserContext';
import { IP, socketConf } from '../../../src/js/Utils/Helpers/services/socket';
import { MediaActions } from '../functional-components/MediaActions';

const messageFromServerWithTrack = (setTracksList) => tracksList => setTracksList([...tracksList]);

export const Songs = (props) => {
    const { navigation } = props;
    const { user } = useContext(UserContext);
    const [searchedTracksList = [], setSearchedTracksList] = useState([]);
    const [tracksList = [], setTracksList] = useState([]);
    const [isSearchingTracks = false, setIsSearchingTracks] = useState(false);
    const tracks = isSearchingTracks ? searchedTracksList : tracksList;
    const socket = io(IP, socketConf);
    const signal = axios.CancelToken.source();
    const mediaAbstractor = new MediaAbstractor('https://api.soundcloud.com/tracks/?limit=50&q=');
    const toastRef = React.createRef();
    const playerRef = React.createRef();

    useEffect(() => {
        console.log('useEffect Songs');
        socket.on('server-send-message-track', messageFromServerWithTrack(setTracksList));
        socket.on('server-send-message-vote', messageFromServerWithTrack(setTracksList));
        socket.on('server-send-message-boost', messageFromServerWithTrack(setTracksList));
        //socket.emit('join-global-playList-moodem', { chatRoom: 'global-playList-moodem', displayName: user.displayName || 'Guest' });
        socket.emit('send-message-track');

        console.log('Songs', tracks);

        return () => {
            axios.Cancel();
            socket.off(messageFromServerWithTrack);
            socket.close();
        };
    }, [tracksList.length]);

    const sendSongToTrackList = (track) => {
        setSearchedTracksList([]);
        setIsSearchingTracks(false);

        Object.assign(track, {
            isMediaOnList: true,
            index: tracksList.length
        });

        socket.emit('send-message-track', track);
    };

    const handleSongActions = (song, songActionsCount, actionName) => {
        if (user && !song.hasVoted && actionName === 'vote') {
            socket.emit(`send-message-${actionName}`, song.id, songActionsCount);
        } else if (user && !song.hasBoosted && actionName === 'boost') {
            socket.emit(`send-message-${actionName}`, song.id, songActionsCount);
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
                onPress: () => sendSongToTrackList(song),
                size: 10,
                raised: true,
                iconStyle: { fontSize: 15, paddingLeft: 2 },
                containerStyle: { marginRight: -10 }
            }}
            buttonGroup={!isSearchingTracks && {
                buttons: [{
                    element: () => (<MediaActions
                        text={song.votes_count}
                        iconName={'thumbs-up'}
                        iconType={'entypo'}
                        iconColor={'#90c520'}
                    />)
                },
                {
                    element: () => (<MediaActions
                        text={song.boosts_count}
                        iconName={'thunder-cloud'}
                        iconType={'entypo'}
                        iconColor={'#00b7e0'}
                    />)
                },
                user && song.user.uid === user.uid ? {
                    element: () => (<MediaActions
                        iconName={'remove'}
                        iconType={'font-awesome'}
                        iconColor={'#dd0031'}
                    />)
                } : ''],
                containerStyle: { position: 'absolute', borderWidth: 0, right: 0, bottom: 0 },
                innerBorderStyle: { color: 'transparent' },
                onPress: (btnIndex) => {
                    switch (btnIndex) {
                        case 0:
                            return handleSongActions(song, ++song.votes_count, 'vote');
                        case 1:
                            return handleSongActions(song, ++song.boosts_count, 'boost');
                        default:
                            return console.log('Pressed Remove');
                    }
                }
            }}
            checkmark={isSearchingTracks && song.isMediaOnList}
            action={() => playerRef.current.handlingTrackedPressed(isSearchingTracks, song)}
        />
    );

    const handlingOnPressSearch = (searchedTracks) => {
        checkIfAlreadyOnList(tracksList, searchedTracks);
        setSearchedTracksList(searchedTracks);
        setIsSearchingTracks(!!searchedTracks.length);
    };

    const onEndEditingSearch = (text) => getData(`${mediaAbstractor.getApiUrl()}${text}&client_id=`, 'soundcloud', signal.token)
        .then(data => handlingOnPressSearch(filterCleanData(data, user)))
        .catch(err => {
            if (axios.isCancel(err)) {
                console.log('post Request canceled');
            }
            console.log('Error', err);
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
                    emptyListComponent={MediaListEmpty}
                    data={tracks}
                    action={({ item }) => renderItem(item)}
                />
            </TracksListContainer>
        </View>
    );
};
