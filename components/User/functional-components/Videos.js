/* eslint-disable max-len */
import React, { useState } from 'react';
import axios from 'axios';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { TracksListContainer } from '../../common/TracksListContainer';

export const getYoutubeVideos = async (myCancelToken, query) => {
    try {
        const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=40&&key=AIzaSyBQmJF-o0d6G2VxaQ1dNzQec-73M3TF7Tw`, {
            cancelToken: myCancelToken,
        });
        return data;
    } catch (error) {
        throw error;
    }
};

export const Videos = (props) => {
    const { navigation } = props;
    const signal = axios.CancelToken.source();
    const [videos = [], setVideos] = useState([]);

    const onEndEditingSearch = async (query) => {
        try {
            const data = await getYoutubeVideos(signal.token, query);
            const videosData = data.items;
            const filteredVideos = videosData && videosData.filter(video => video.id.kind !== 'youtube#channel');
            setVideos([...filteredVideos]);
            console.log('Videos', filteredVideos);
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Error: ', err.message);
            }
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
                        source={{ html: `<iframe width="380" height="300" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>` }}
                    />
                </View>)}
            titleStyle={{ textAlign: 'left', paddingBottom: 20 }}
            titleProps={{ numberOfLines: 3 }}
            title={video.snippet && video.snippet.title}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            chevron={false}
        />
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <CommonTopSearchBar placeholder="Search song..." onEndEditingSearch={onEndEditingSearch} />
            <TracksListContainer>
                <CommonFlatList
                    emptyListComponent={() => <View><Text>NO VIDEOS</Text></View>}
                    data={videos}
                    action={({ item }) => renderItem(item)}
                />
            </TracksListContainer>
        </View>
    );
};
