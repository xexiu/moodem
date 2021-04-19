/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from 'react-native-elements';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import MemoizedItems from '../../../components/common/functional-components/MemoizedItems';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import Player from '../../../components/common/functional-components/Player';

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
        indexItem: 0,
        isLoading: true
    });
    const basePlayer = useRef(null);
    const repeatRef = useRef(null);
    const playPauseRef = useRef(null);
    const seekRef = useRef(null);
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
            source.cancel('SearchingSongsScreen Component got unmounted');
            media.socket.off('search-songs-on-youtube');
            media.socket.off('get-songs-from-youtube');
        };
    }, [isFocused]);

    const onClickUseCallBack = useCallback((index: number) => {
        resetLoadingSongs(true);
        setAllValues((prev: any) => {
            if (prev.indexItem === index) {
                prev.songs[index].isPlaying = !prev.songs[index].isPlaying;
            } else {
                prev.songs[prev.indexItem].isPlaying = false;
                prev.songs[index].isPlaying = !prev.songs[index].isPlaying;
            }
            return {
                ...prev,
                indexItem: index,
                songs: [...prev.songs]
            };
        });
    }, []);

    function resetSearchingScreen(){
        setAllValues(prevValues => {
            return {
                ...prevValues,
                songs: [],
                isLoading: true
            };
        });
        navigation.setOptions({
            unmountInactiveRoutes: true
        });
        //resetLoadingSongs(false);
        navigation.navigate(media.group.group_name);
    }

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

    function renderPlayer() {
        if (allValues.songs.length) {
            return (
                <Player
                    repeatRef={repeatRef}
                    playPauseRef={playPauseRef}
                    songsListRef={songsListRef}
                    basePlayer={basePlayer}
                    seekRef={seekRef}
                    isPlaying={allValues.songs[allValues.indexItem].isPlaying}
                    item={allValues.songs[allValues.indexItem]}
                    onClick={onClickUseCallBack}
                />
            );
        }
        return null;
    }

    console.log('Searchedsongs');

    return (
        <BodyContainer>
            <Icon
                containerStyle={{ position: 'absolute', top: 5, left: 10, zIndex: 100}}
                onPress={resetSearchingScreen}
                name={'arrow-back'}
                type={'Ionicons'}
                size={25}
                color='#dd0031'
            />
            { renderPlayer() }
            <MemoizedItems
                data={allValues.songs}
                handleOnClickItem={onClickUseCallBack}
                media={media}
                buttonActions={['send_media']}
                optionalCallback={resetSearchingScreen}
            />
        </BodyContainer>
    );
};

export default memo(SearchingSongsScreen);
