import { YOUTUBE_KEY } from '@env';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Icon } from 'react-native-elements';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import MemoizedPlayerSongsList from '../../../components/common/functional-components/MemoizedPlayerSongsList';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import { AppContext } from '../../../components/User/store-context/AppContext';
import MediaListEmpty from '../../../screens/User/functional-components/MediaListEmpty';
import { loadFromLocalStorage, removeItem, saveOnLocalStorage } from '../../../src/js/Utils/common/storageConfig';
import { checkIfAlreadyOnList } from '../../../src/js/Utils/Helpers/actions/songs';

const THIRTY_DAYS = 1000 * 3600 * 24 * 30;
const ONE_YEAR = THIRTY_DAYS * 365;

const SearchSongScreen = (props: any) => {
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
        const sanitizedText = encodeURIComponent(searchedText).toLowerCase();
        const videoIdsFromLocalStorage = await loadFromLocalStorage(sanitizedText);

        switch (videoIdsFromLocalStorage) {
        case 'NotFoundError':
            const videoIds = await fetchResults();
            saveOnLocalStorage(sanitizedText, videoIds, ONE_YEAR);
            socket.emit('search-songs-on-youtube', { chatRoom: group.group_name, videoIds });
            break;
        case 'ExpiredError':
            removeItem(sanitizedText, async () => {
                const videoIds_1 = await fetchResults();
                saveOnLocalStorage(sanitizedText, videoIds_1, ONE_YEAR);
                socket.emit('search-songs-on-youtube', { chatRoom: group.group_name, videoIds: videoIds_1 });
            });
            break;
        default:
            socket.emit('search-songs-on-youtube', { chatRoom: group.group_name, videoIds: videoIdsFromLocalStorage });
            break;
        }
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

            socket.on('get-songs-from-youtube', getSongs);
            socket.on('song-error-searching', getSongWithError);
        }

        return () => {
            source.cancel('SearchSongScreen Component got unmounted');
            socket.off('search-songs-on-youtube', getSongs);
            socket.off('get-songs-from-youtube', getSongs);
            socket.off('song-error-searching', getSongWithError);
        };
    }, [isFocused]);

    function getSongWithError({ song }: any) {
        return setAllValues(prev => {
            Object.assign(prev.songs[song.id], {
                url: song.url
            });
            return {
                ...prev,
                songs: [...prev.songs]
            };
        });
    }

    function getSongs(data: any) {
        checkIfAlreadyOnList(songs, data.songs);

        return setAllValues(prevValues => {
            return {
                ...prevValues,
                songs: [...data.songs],
                indexItem: songs.indexItem || 0,
                isLoading: false
            };
        });
    }

    const onClickUseCallBack = useCallback(async (index: number) => {
        await resetLoadingSongs(true);

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
    }, [searchedText, allValues.indexItem]);

    const memoizedPlayerSongsListCallBack = useCallback(() => {
        if (allValues.songs && !allValues.songs.length) {
            return (<MediaListEmpty />);
        }

        return (
            <MemoizedPlayerSongsList
                data={allValues.songs}
                buttonActions={['send_media']}
                handleOnClickItem={onClickUseCallBack}
                optionalCallback={resetSearchingScreen}
                indexItem={allValues.indexItem}
            />
        );
    }, [allValues.songs, allValues.indexItem]);

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
            <BodyContainer>
                { renderBackButton()}
                <PreLoader
                    containerStyle={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    size={50}
                />
            </BodyContainer>
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
            { memoizedPlayerSongsListCallBack()}
        </BodyContainer>
    );
};

export default memo(SearchSongScreen);