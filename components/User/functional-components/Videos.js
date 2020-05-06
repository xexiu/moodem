/* eslint-disable max-len */
import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import { TracksListContainer } from '../../common/TracksListContainer';
import { IP, socketConf } from '../../../src/js/Utils/Helpers/services/socket';
import { UserContext } from '../../User/functional-components/UserContext';
import { getYoutubeVideos, filterCleanData } from '../../../src/js/Utils/Helpers/actions/videos';
import { checkIfAlreadyOnList } from '../../../src/js/Utils/Helpers/actions/common';

const messageFromServerWithVideo = (setVideos) => videos => setVideos([...videos]);

export const Videos = (props) => {
    const { navigation } = props;
    const { user } = useContext(UserContext);
    const signal = axios.CancelToken.source();
    const [videos = [], setVideos] = useState([]);
    const [isSearchingVideos = false, setIsSearchingVideos] = useState(false);
    const [searchedVideosList = [], setSearchedVideosList] = useState([]);
    const videosList = isSearchingVideos ? searchedVideosList : videos;
    const socket = io(IP, socketConf);

    useEffect(() => {
        console.log('useEffect Videos');
        socket.on('server-send-message-video', messageFromServerWithVideo(setVideos));
        // socket.on('server-send-message-vote', this.messageFromServerWithVote.bind(this));
        // socket.on('server-send-message-boost', this.messageFromServerWithBoost.bind(this));
        socket.emit('send-message-video');

        return () => {
            axios.Cancel();
            socket.off(messageFromServerWithVideo);
            // socket.off(this.messageFromServerWithVote);
            // socket.off(this.messageFromServerWithBoost);
            socket.close();
        };
    }, [videos.length]);

    const handlingOnPressSearch = (searchedVideos) => {
        checkIfAlreadyOnList(videos, searchedVideos);
        setSearchedVideosList(searchedVideos);
        setIsSearchingVideos(!!searchedVideos.length);
    };

    const onEndEditingSearch = async (query) => {
        try {
            const data = await getYoutubeVideos(signal.token, query);
            handlingOnPressSearch(filterCleanData(data.items, user));
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Error: ', err.message);
            }
        }
    };

    const sendVideoToList = (video) => {
        setSearchedVideosList([]);
        setIsSearchingVideos(false);

        Object.assign(video, {
            isMediaOnList: true,
            index: videos.length
        });

        socket.emit('send-message-video', video);
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
};
