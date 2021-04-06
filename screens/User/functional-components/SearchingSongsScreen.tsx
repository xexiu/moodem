/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Icon } from 'react-native-elements';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import Song from '../../../components/User/functional-components/Song';
import SongsList from '../../../components/User/functional-components/SongsList';

const SearchingSongsScreen = (props: any) => {
    const {
        media,
        group,
        user,
        searchedText,
        songsOnGroup,
        resetLoadingSongs
    } = props.route.params;
    const songsListRef = useRef(null);

    const { navigation } = props;
    const [allValues, setAllValues] = useState({
        songs: [],
        isLoading: true
    });
    const source = axios.CancelToken.source();
    const isFocused = useIsFocused();

    // async function getResultsForSearch(): Promise<string[]> {
    //     const videoIds = ['8SbUC-UaAxE', 'tAGnKpE4NCI', 'aw_cmzF_uZY', 'iuTtlb2COtc'] as string[];
    //     try {
    //         // const { data } = await axios.get(
    //         //     `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchedText}&maxResults=3&videoCategoryId=10&type=video&key=AIzaSyCNAtpEYrSP4SCmk4FnXB0DxAw_JefBcGw`,
    //         //     { cancelToken: source.token });

    //         const { data } = await axios.get('http://dummy.com',
    //             { cancelToken: source.token });
    //         // const videos = data.items.filter((video: any) => video.id.videoId);
    //         // videos.map((video: any) => {
    //         //     videoIds.push(video.id.videoId);
    //         // });

    //         console.log('Dataaa', data.replace(/(.*)/g, '').trim());
    //         return Promise.resolve(videoIds);
    //     } catch (err) {
    //         return Promise.reject(videoIds);
    //     }
    // }

    useEffect(() => {
        // console.log('4. Searching songs screen...', allValues.isLoading);
        navigation.setOptions({
            headerShown: false,
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true
        });

        if (isFocused) {
            // getResultsForSearch()
            //     .then(videoIds => {
            //     });

            const videoIds = ['8SbUC-UaAxE', 'tAGnKpE4NCI', 'aw_cmzF_uZY', 'iuTtlb2COtc', 'ElU-VcWEhRU', 'ieBvA3kMJB4', '2GhF2mPKnDg'] as string[];

            media.emit('search-songs-on-youtube', { chatRoom: group.group_name, videoIds });
            media.on('get-songs-from-youtube', (data: any) => {
                media.checkIfAlreadyOnList(songsOnGroup, data.songs);
                setAllValues(prevValues => {
                    return {
                        ...prevValues,
                        songs: [...data.songs],
                        isLoading: false
                    };
                });
            });
        }

        return () => {
            // console.log('OFF SEARCHED SCREEN');
            source.cancel('SearchingSongsScreen Component got unmounted');
            media.socket.off('search-songs-on-youtube');
            media.socket.off('get-songs-from-youtube');
        };
    }, [isFocused]);

    if (allValues.isLoading) {
        return (
            <PreLoader
                containerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                size={50}
            />
        );
    }

    const renderItem = (item: any, handlePress: Function, currentSong: any) => {
        return (<Song
            navigation={navigation}
            group={group}
            isSearching={true}
            isComingFromSearchingSong={false}
            song={item}
            media={media}
            isPlaying={item.isPlaying}
            currentSong={currentSong}
            resetLoadingSongs={resetLoadingSongs}
            handlePress={() => {
                resetLoadingSongs(true);
                return handlePress(currentSong);
            }}
        />);
    };

    // console.log('Searchedsongs');

    return (
        <BodyContainer>
            <Icon
                containerStyle={{ position: 'absolute', top: 5, left: 10, zIndex: 100}}
                onPress={() => {
                    navigation.setOptions({
                        unmountInactiveRoutes: true
                    });
                    resetLoadingSongs(false);
                    navigation.goBack();
                }}
                name={'arrow-back'}
                type={'Ionicons'}
                size={25}
                color='#dd0031'
            />
            <SongsList
                ref={songsListRef}
                isSearching={true}
                isComingFromSearchingSong={false}
                isRemovingSong={false}
                data={allValues}
                renderItem={renderItem}
            />
        </BodyContainer>
    );
};

export default memo(SearchingSongsScreen);
