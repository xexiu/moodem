import axios from 'axios';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import MemoizedSongsList from '../../../components/common/functional-components/MemoizedSongsList';
import Player from '../../../components/common/functional-components/Player';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { SongsContext } from '../../../components/User/store-context/SongsContext';
import MediaListEmpty from '../../../components/User/functional-components/MediaListEmpty';
import { checkIfAlreadyOnList } from '../../../src/js/Utils/Helpers/actions/songs';

const SearchSongScreen = (props: any) => {
    const {
        searchedText
    } = props.route.params;
    const { group, socket } = useContext(AppContext) as any;
    const {
        dispatchContextSongs,
        songs
    } = useContext(SongsContext) as any;

    const { navigation } = props;
    const [allValues, setAllValues] = useState({
        songs: [],
        indexItem: 0,
        isLoading: true
    });
    const source = axios.CancelToken.source();

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true,
            title: `${allValues.songs.length} encontrado(s)`
        });
        socket.emit('search-songs', {
            chatRoom: `GroupId_${group.group_id}_GroupName_${group.group_name}`,
            searchedText
        });

        socket.on('get-songs', getSongs);
        socket.on('song-error-searching', getSongWithError);

        return () => {
            source.cancel('SearchSongScreen Component got unmounted');
            socket.off('search-songs', getSongs);
            socket.off('get-songs', getSongs);
            socket.off('song-error-searching', getSongWithError);
        };
    }, []);

    function getSongWithError({ song }: any) {
        return setAllValues(prev => {
            const indexInArray = prev.songs.findIndex(_song => _song.id === song.id);

            if (indexInArray > -1) {
                Object.assign(prev.songs[indexInArray], {
                    url: song.url
                });
            }

            return {
                ...prev,
                songs: [...prev.songs]
            };
        });
    }

    function getSongs(data: any) {
        checkIfAlreadyOnList(songs, data.songs);
        navigation.setOptions({ title: `${data.songs.length} encontrado(s)` });

        return setAllValues(prevValues => {
            return {
                ...prevValues,
                songs: [...data.songs],
                indexItem: 0,
                isLoading: false
            };
        });
    }

    const resetSongs = useCallback((() => {
        let executed = false;
        return () => {
            if (!executed) {
                executed = true;
                return dispatchContextSongs({ type: 'update_song_reset' });
            }
        };
    })(), []);

    const onClickUseCallBack = useCallback(async (index: number) => {
        await resetSongs();

        return setAllValues((prev: any) => {
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

    const memoizedPlayerSongsListCallBack = useCallback(() => {
        const { indexItem } = allValues;

        if (allValues.songs && !allValues.songs.length) {
            return (<MediaListEmpty />);
        }

        return (
            <BodyContainer>
                <Player
                    isPlaying={allValues.songs[indexItem].isPlaying}
                    item={allValues.songs[indexItem]}
                    handleOnClickItem={onClickUseCallBack}
                    items={allValues.songs}
                    indexItem={indexItem}
                />
                <MemoizedSongsList
                    data={allValues.songs}
                    chevron={'send_media'}
                    indexItem={indexItem}
                    handleOnClickItem={onClickUseCallBack}
                />
            </BodyContainer>
        );
    }, [allValues.songs, allValues.indexItem]);

    if (allValues.isLoading) {
        return (
            <BodyContainer>
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

    return (
        <BodyContainer>
            {memoizedPlayerSongsListCallBack()}
        </BodyContainer>
    );
};

export default memo(SearchSongScreen);
