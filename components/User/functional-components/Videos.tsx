/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { useState, useEffect, memo } from 'react';
import { View, Keyboard } from 'react-native';
import { WebView } from 'react-native-webview';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import { TracksListContainer } from '../../common/functional-components/TracksListContainer';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/videos';
import { MediaActions } from './ButtonsMedia';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { SearchingList } from './SearchingList';
import { AbstractMedia } from '../../common/functional-components/AbstractMedia';

const YOTUBE_SEARCH_API = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=';

const setMediaIndex = (song, index) => {
    Object.assign(song, {
        index
    });
};


export const Videos = memo((props) => {
    const [videos = [], setVideos] = useState([]);
    const [items = [], setItems] = useState([]);
    const [videoId = '', setVideoId] = useState('');
    const [isSearching = false, setIsSearching] = useState(false);
    const abstractMedia = new AbstractMedia(props, YOTUBE_SEARCH_API);
    const mediaBuilder = abstractMedia.mediaBuilder;

    useEffect(() => {
        console.log('On useEffect Videos');
        mediaBuilder.msgFromServer(abstractMedia.socket, (_videos) => {
            _videos.forEach(setMediaIndex);
            setVideos([..._videos]);
        });
        mediaBuilder.msgToServer(abstractMedia.socket, 'send-message-media', { video: true, chatRoom: 'global-moodem-videoPlaylist' });

        return () => {
            console.log('Off useEffect Videos');
            abstractMedia.destroy();
        };
    }, []);

    const onEndEditingSearch = (text) => mediaBuilder.getData(`${mediaBuilder.getApi()}${text}&maxResults=40&key=`, 'youtube', abstractMedia.signal.token)
        .then(_items => {
            const filteredVideos = filterCleanData(_items.items, abstractMedia.user);
            mediaBuilder.checkIfAlreadyOnList(videos, filteredVideos);
            setIsSearching(!!filteredVideos.length);
            setItems([...filteredVideos]);
        })
        .catch(err => {
            if (abstractMedia.axios.isCancel(err)) {
                throw new Error('Search Videos Request Canceled Axios', err);
            }
            throw new Error('Error Videos Search', err);
        });

    const sendMediaToServer = (video) => {
        setVideos([]);
        setIsSearching(false);

        Object.assign(video, {
            isMediaOnList: true
        });

        mediaBuilder.msgToServer(abstractMedia.socket, 'send-message-media', { video, chatRoom: 'global-moodem-videoPlaylist' });
    };

    const renderItem = (video) => (
        <CommonFlatListItem
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
            buttonGroup={!isSearching && {
                buttons: [{
                    element: () => (<MediaActions
                        disabled={video.voted_users.some(id => id === abstractMedia.user.uid)}
                        text={video.votes_count}
                        iconName={'thumbs-up'}
                        iconType={'entypo'}
                        iconColor={'#90c520'}
                        action={() => abstractMedia.handleMediaActions('send-message-vote', { video, chatRoom: 'global-moodem-videoPlaylist', user_id: abstractMedia.user.uid, count: ++video.votes_count })}
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
                abstractMedia.user && !!video.user && video.user.uid === abstractMedia.user.uid && {
                    element: () => (<MediaActions
                        iconName={'remove'}
                        iconType={'font-awesome'}
                        iconColor={'#dd0031'}
                        action={() => {
                            setVideoId('');
                            abstractMedia.handleMediaActions('send-message-remove', { video, chatRoom: 'global-moodem-videoPlaylist', user_id: abstractMedia.user.uid });
                        }}
                    />)
                }],
                containerStyle: { position: 'absolute', borderWidth: 0, right: 0, bottom: 0 },
                innerBorderStyle: { color: 'transparent' }
            }}
            checkmark={isSearching && video.isMediaOnList}
            action={() => setVideoId(video.id)}
        />
    );

    const resetSearch = () => {
        abstractMedia.searchRef.current.clear();
        abstractMedia.searchRef.current.blur();
        setIsSearching(false);
        Keyboard.dismiss();
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }} onStartShouldSetResponder={resetSearch}>
            <BurgerMenuIcon
                action={() => {
                    resetSearch();
                    abstractMedia.navigation.openDrawer();
                }}
                customStyle={{ top: -5, left: 0, width: 30, height: 30 }}
            />
            <CommonTopSearchBar
                placeholder="Search video..."
                cancelSearch={() => setIsSearching(false)}
                onEndEditingSearch={onEndEditingSearch}
                searchRef={abstractMedia.searchRef}
                customStyleContainer={{ width: '85%', marginLeft: 55 }}
            />
            <View style={{ height: 200, width: 300, alignSelf: 'center' }}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>` }}
                />
            </View>
            <TracksListContainer>
                {isSearching ?
                    <SearchingList player={(video) => setVideoId(video.id)} handler={sendMediaToServer} items={items} /> :
                    <CommonFlatList
                        emptyListComponent={MediaListEmpty}
                        data={videos}
                        action={({ item }) => renderItem(item)}
                    />
                }
            </TracksListContainer>
        </View>
    );
});
