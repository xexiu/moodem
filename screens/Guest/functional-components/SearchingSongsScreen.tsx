import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Icon } from 'react-native-elements';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import MemoizedItems from '../../../components/common/functional-components/MemoizedItems';
import Player from '../../../components/common/functional-components/Player';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { loadFromLocalStorage, removeItem, saveOnLocalStorage } from '../../../src/js/Utils/common/storageConfig';
import { YOUTUBE_KEY } from '../../../src/js/Utils/constants/api/apiKeys';
import { checkIfAlreadyOnList } from '../../../src/js/Utils/Helpers/actions/songs';

const THIRTY_DAYS = 1000 * 3600 * 24 * 30;

const SearchingSongsScreen = (props: any) => {
    const {
        songs,
        searchedText,
        resetLoadingSongs
    } = props.route.params;
    const { group, socket } = useContext(AppContext) as any;

    const { navigation } = props;
    const [allValues, setAllValues] = useState({
        songs: [],
        indexItem: 0,
        isLoading: true
    });
    const source = axios.CancelToken.source();
    const isFocused = useIsFocused();

    async function fetchResults() {
        const videoIds = [] as string[];
        try {
            const { data } = await axios.get(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchedText}&maxResults=15&videoCategoryId=10&type=video&key=${YOUTUBE_KEY}`,
                { cancelToken: source.token });

            const videos = data.items.filter((video: any) => video.id.videoId);
            videos.map((video: any) => {
                videoIds.push(video.id.videoId);
            });
            return Promise.resolve(videoIds);
        } catch (err) {
            // Send error to sentry
        }
    }

    async function getResultsForSearch(): Promise<any> {
        const sanitizedText = searchedText.replace(/\s+/g, '').toLowerCase();
        const savedItem = loadFromLocalStorage(sanitizedText);

        return savedItem.then(async (data) => {
            switch (data) {
            case 'NotFoundError':
                const videoIds = await fetchResults();
                saveOnLocalStorage(sanitizedText, videoIds, THIRTY_DAYS);
                socket.emit('search-songs-on-youtube', { chatRoom: group.group_name, videoIds });
                break;
            case 'ExpiredError':
                removeItem(sanitizedText, async () => {
                    const videoIds_1 = await fetchResults();
                    saveOnLocalStorage(sanitizedText, videoIds_1, THIRTY_DAYS);
                    socket.emit('search-songs-on-youtube', { chatRoom: group.group_name, videoIds: videoIds_1 });
                });
                break;
            default:
                socket.emit('search-songs-on-youtube', { chatRoom: group.group_name, videoIds: data });
                break;
            }
        });
    }

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true
        });

        if (isFocused) {
            getResultsForSearch();

            socket.on('get-songs-from-youtube', (data: any) => {
                checkIfAlreadyOnList(songs, data.songs);
                setAllValues(prevValues => {
                    return {
                        ...prevValues,
                        songs: [...data.songs],
                        indexItem: songs.indexItem || 0,
                        isLoading: false
                    };
                });
            });
        }

        return () => {
            source.cancel('SearchingSongsScreen Component got unmounted');
            socket.off('search-songs-on-youtube');
            socket.off('get-songs-from-youtube');
        };
    }, [isFocused]);

    const playerCallBack = useCallback(() => {
        if (allValues.songs.length) {
            return (
                <Player
                    isPlaying={allValues.songs[allValues.indexItem].isPlaying}
                    item={allValues.songs[allValues.indexItem]}
                    handleOnClickItem={onClickUseCallBack}
                    items={allValues.songs}
                />
            );
        }
        return null;
    }, [allValues.songs]);

    const renderItemsCallBack = useCallback(() => {
        return (
            <MemoizedItems
                data={allValues.songs}
                handleOnClickItem={onClickUseCallBack}
                buttonActions={['send_media']}
                optionalCallback={resetSearchingScreen}
            />
        );
    }, [allValues.songs]);

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
    }, [searchedText]);

    function resetSearchingScreen() {
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
        navigation.navigate(group.group_name);
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

    function renderBackButton() {
        return (
            <Icon
                containerStyle={{ position: 'absolute', top: 5, left: 10, zIndex: 100 }}
                onPress={resetSearchingScreen}
                name={'arrow-back'}
                type={'Ionicons'}
                size={25}
                color='#dd0031'
            />
        );
    }

    return (
        <BodyContainer>
            { renderBackButton()}
            { playerCallBack()}
            { renderItemsCallBack()}
        </BodyContainer>
    );
};

export default memo(SearchingSongsScreen);
