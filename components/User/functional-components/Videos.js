/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { useState, useEffect, useContext, memo } from 'react';
import axios from 'axios';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import { TracksListContainer } from '../../common/TracksListContainer';
import { UserContext } from '../../User/functional-components/UserContext';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/videos';
import {
    checkIfAlreadyOnList,
    getData,
    MediaBuilder
} from '../../../src/js/Utils/Helpers/actions/common';
import { MediaActions } from '../functional-components/MediaActions';

const setMediaList = (setVideos) => videos => setVideos([...videos]);

export const Videos = memo((props) => {
    const { navigation } = props;
    const { user } = useContext(UserContext);
    const [videos = [], setVideos] = useState([]);
    const [searchedVideosList = [], setSearchedVideosList] = useState([]);
    const [isSearchingVideos = false, setIsSearchingVideos] = useState(false);
    const videosList = isSearchingVideos ? searchedVideosList : videos;
    const media = new MediaBuilder();
    const socket = media.socket();
    const signal = axios.CancelToken.source();
    media.setApi('https://www.googleapis.com/youtube/v3/search?part=snippet&q=');

    useEffect(() => {
        console.log('useEffect Videos');
        media.msgFromServer(socket, setMediaList(setVideos));
        media.msgToServer(socket, 'send-message-media', { video: true, chatRoom: 'global-moodem-videosPlaylist' });

        return () => {
            axios.Cancel();
            socket.off(media.msgFromServer);
            socket.close();
        };
    }, [videos.length]);

    const handlingOnPressSearch = (searchedVideos) => {
        checkIfAlreadyOnList(videos, searchedVideos);
        setSearchedVideosList(searchedVideos);
        setIsSearchingVideos(!!searchedVideos.length);
    };

    const onEndEditingSearch = (text) => getData(`${media.getApi()}${text}&maxResults=40&key=`, 'youtube', signal.token)
        .then(data => handlingOnPressSearch(filterCleanData(data.items, user)))
        .catch(err => {
            if (axios.isCancel(err)) {
                console.log('post Request canceled');
            }
            console.log('Error', err);
        });

    const sendVideoToList = (video) => {
        setSearchedVideosList([]);
        setIsSearchingVideos(false);

        Object.assign(video, {
            isMediaOnList: true,
            index: videos.length
        });

        socket.emit('send-message-media', { video, chatRoom: 'global-moodem-videosPlaylist' });
    };

    const handleVideoActions = (video, count, actionName) => {
        if (user && actionName === 'vote') {
            socket.emit(`send-message-${actionName}`, { video, chatRoom: 'global-moodem-videosPlaylist', user_id: user.uid, videoId: video.id, count });
        } else if (user && !video.hasBoosted && actionName === 'boost') {
            socket.emit(`send-message-${actionName}`, { video, chatRoom: 'global-moodem-videosPlaylist', videoId: video.id, count });
        } else if (user && !video.hasBoosted && actionName === 'remove') {
            socket.emit(`send-message-${actionName}`, { video, chatRoom: 'global-moodem-videosPlaylist', videoId: video.id });
        } else if (!user) {
            navigation.navigate('Guest');
        }
    };

    const renderItem = (video) => (
        <CommonFlatListItem
            disabled
            bottomDivider
            leftElement={() => (
                <View style={{ height: 100, width: 100, alignContent: 'flex-start' }}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: `<iframe width="380" height="300" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>` }}
                    />
                </View>)}
            titleStyle={{ textAlign: 'left', paddingBottom: 20 }}
            titleProps={{ numberOfLines: 3 }}
            title={video.title}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            chevron={isSearchingVideos && !video.isMediaOnList && {
                color: '#dd0031',
                onPress: () => sendVideoToList(video),
                size: 10,
                raised: true,
                iconStyle: { fontSize: 15, paddingLeft: 2 },
                containerStyle: { marginRight: -10 }
            }}
            buttonGroup={!isSearchingVideos && {
                buttons: [{
                    element: () => (<MediaActions
                        disabled={video.boosted_users.some(id => id === user.uid)}
                        text={video.votes_count}
                        iconName={'thumbs-up'}
                        iconType={'entypo'}
                        iconColor={'#90c520'}
                        action={() => handleVideoActions(video, ++video.votes_count, 'vote')}
                    />)
                },
                // {
                //     element: () => (<MediaActions
                //         text={video.boosts_count}
                //         iconName={'thunder-cloud'}
                //         iconType={'entypo'}
                //         iconColor={'#00b7e0'}
                //     />)
                // },
                user && !!video.user && video.user.uid === user.uid && {
                    element: () => (<MediaActions
                        iconName={'remove'}
                        iconType={'font-awesome'}
                        iconColor={'#dd0031'}
                        action={() => handleVideoActions(video, null, 'remove')}
                    />)
                }],
                containerStyle: { position: 'absolute', borderWidth: 0, right: 0, bottom: 0 },
                innerBorderStyle: { color: 'transparent' }
            }}
            checkmark={isSearchingVideos && video.isMediaOnList}
        />
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <CommonTopSearchBar placeholder="Search video..." onEndEditingSearch={onEndEditingSearch} />
            <TracksListContainer>
                <CommonFlatList
                    emptyListComponent={MediaListEmpty}
                    data={videosList}
                    action={({ item }) => renderItem(item)}
                />
            </TracksListContainer>
        </View>
    );
});
