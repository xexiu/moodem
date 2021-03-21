/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/stack';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Text, TouchableHighlight, View } from 'react-native';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import CommonFlatList from '../../../components/common/functional-components/CommonFlatList';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import Player from '../../../components/common/Player';
import Song from '../../../components/User/functional-components/Song';

const SearchingSongsScreen = (props: any) => {
    const {
        media,
        group,
        user,
        searchedText,
        songsOnGroup,
        resetLoadingSongs
    } = props.route.params;

    const { navigation } = props;
    const [allValues, setAllValues] = useState({
        searchedSongs: [],
        isLoading: true
    });
    const source = axios.CancelToken.source();
    const isFocused = useIsFocused();
    const player = useRef(null);
    const basePlayer = useRef(null);
    const flatListRef = useRef(null);
    const repeatRef = useRef(null);
    const playPauseRef = useRef(null);
    const seekRef = useRef(null);
    const controller = new AbortController();
    const playerInstance = (<Player
        isSearching={true}
        navigation={navigation}
        ref={player}
        player={player}
        basePlayer={basePlayer}
        flatListRef={flatListRef}
        repeatRef={repeatRef}
        playPauseRef={playPauseRef}
        seekRef={seekRef}
        renderItem={(item: any, index: number) => renderItem(item, index)}
        media={media}
        tracks={allValues.searchedSongs}
    />);

    async function getResultsForSearch(): Promise<string[]> {
        const videoIds = ['8SbUC-UaAxE', 'tAGnKpE4NCI', 'aw_cmzF_uZY', 'iuTtlb2COtc'] as string[];
        try {
            // const { data } = await axios.get(
            //     `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchedText}&maxResults=3&videoCategoryId=10&type=video&key=AIzaSyCNAtpEYrSP4SCmk4FnXB0DxAw_JefBcGw`,
            //     { cancelToken: source.token });

            const { data } = await axios.get('http://dummy.com',
                { cancelToken: source.token });
            // const videos = data.items.filter((video: any) => video.id.videoId);
            // videos.map((video: any) => {
            //     videoIds.push(video.id.videoId);
            // });

            console.log('Dataaa', data.replace(/(.*)/g, '').trim());
            return Promise.resolve(videoIds);
        } catch (err) {
            return Promise.reject(videoIds);
        }
    }

    useEffect(() => {
        console.log('4. Searching songs screen...', allValues.isLoading);
        navigation.setOptions({
            title: props.route.params.group.group_name,
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            headerLeft: () => <HeaderBackButton
                labelVisible={false}
                onPress={() => {
                    resetLoadingSongs(false);
                    source.cancel('SearchingSongsScreen Component got unmounted');
                    setAllValues(prevValues => {
                        return {
                            ...prevValues,
                            isLoading: true
                        };
                    });
                    navigation.goBack();
                }
                }
            />
        });

        if (isFocused) {
            // getResultsForSearch()
            //     .then(videoIds => {
            //     });

            const videoIds = ['8SbUC-UaAxE', 'tAGnKpE4NCI', 'aw_cmzF_uZY', 'iuTtlb2COtc'] as string[];

            media.emit('search-songs-on-youtube', { chatRoom: group.group_name, videoIds });
            media.on('get-songs-from-youtube', (data: any) => {
                media.checkIfAlreadyOnList(songsOnGroup, data.audios);
                setAllValues(prevValues => {
                    return {
                        ...prevValues,
                        searchedSongs: [...data.audios],
                        isLoading: false
                    };
                });
            });
        }

        return () => {
            console.log('Cancel search');
            // source.cancel('SearchingSongsScreen Component got unmounted');
            // controller.abort();
            // media.destroy();
            media.socket.off('emit-medias-group');
        };

    }, [isFocused]);

    const sendMediaToServer = (song: any) => {
        Object.assign(song, {
            isMediaOnList: true
        });

        media.emit('emit-medias-group', { song, chatRoom: group.group_name, isComingFromSearchingSong: true });

        // media.destroy();
        setAllValues(prevValues => {
            return {
                ...prevValues,
                isLoading: true
            };
        });
        navigation.goBack();
    };

    const renderItem = useCallback((item, index) => {
        console.log('item', index);
        return (<Song
            isSearching={true}
            resetLoadingSongs={resetLoadingSongs}
            song={item}
            media={media}
            playPauseRef={playPauseRef}
            sendMediaToServer={sendMediaToServer}
        />);
    }, []);

    if (allValues.isLoading) {
        return (
            <View>
                <PreLoader
                    containerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    size={50}
                />
            </View>
        );
    }

    console.log('Searchedsongs', allValues.searchedSongs);

    return (
        <BodyContainer customBodyContainerStyle={{ paddingTop: 10 }}>
            {playerInstance}
        </BodyContainer>
    );
};

const areEqual = (prevProps: any, nextProps: any) => {
    console.log('PREVV SearchingScreen', prevProps, 'NExtt', nextProps);

    return true;
};

export default memo(SearchingSongsScreen, areEqual);
