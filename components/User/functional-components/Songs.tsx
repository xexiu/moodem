
import PropTypes from 'prop-types';
import React, { memo, useCallback, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import MediaListEmpty from '../../../screens/User/functional-components/MediaListEmpty';
import { loadFromLocalStorage, removeItem, saveOnLocalStorage } from '../../../src/js/Utils/common/storageConfig';
import { convertVideoIdsFromDB } from '../../../src/js/Utils/Helpers/actions/songs';
import BodyContainer from '../../common/functional-components/BodyContainer';
import CustomButton from '../../common/functional-components/CustomButton';
import MemoizedPlayerSongsList from '../../common/functional-components/MemoizedPlayerSongsList';
import PreLoader from '../../common/functional-components/PreLoader';
import SearchBarAutoComplete from '../../common/functional-components/SearchBarAutoComplete';
import { AppContext } from '../store-context/AppContext';
import { SongsContext } from '../store-context/SongsContext';

const Songs = (props: any) => {
    const { navigation } = props;
    const { group, isServerError, socket } = useContext(AppContext) as any;
    const {
        dispatchContextSongs,
        songs,
        isLoading
    } = useContext(SongsContext) as any;

    useEffect(() => {
        if (!isServerError) {
            socket.on('get-medias-group', getSongs);
            socket.on('song-added', getSong);
            socket.on('song-removed', getRemovedSong);
            socket.on('song-voted', getVotedSong);
            socket.on('song-error', getSongWithError);
            socket.emit('emit-medias-group', { chatRoom: group.group_name });
        }

        return () => {
            console.log('OFF SONGS');
            socket.off('get-medias-group', getSongs);
            socket.off('emit-medias-group');
        };
    }, []);

    function dispatchCommon(data: any = []) {
        return dispatchContextSongs({
            type: 'set_songs',
            value: {
                songs: [...data],
                isLoading: false,
                removedSong: null,
                votedSong: null,
                addedSong: null,
                transformedSong: null
            }
        });
    }

    async function convertVideosIdsCommon() {
        const audios = await convertVideoIdsFromDB(group.group_songs);
        saveOnLocalStorage(group.group_name, audios).then(() => dispatchCommon(audios));
    }

    async function getSongsFromStorageOrConvert() {
        const songsFromStorage = await loadFromLocalStorage(group.group_name) || [];

        switch (songsFromStorage) {
        case 'NotFoundError':
            return convertVideosIdsCommon();
        case 'ExpiredError':
            return convertVideosIdsCommon();
        default:
            const groupSongsLen = group.group_songs && group.group_songs.length;

            if (songsFromStorage.length !== groupSongsLen) {
                return removeItem(group.group_name, () => {
                    return convertVideosIdsCommon();
                });
            }

            return songsFromStorage || [];
        }
    }

    async function getSongs(data: any) {
        const groupSongsLen = group.group_songs && group.group_songs.length;

        if (data.songs.length !== groupSongsLen) {
            const songsFromStorage = await getSongsFromStorageOrConvert() || [];

            socket.emit('emit-set-medias', { chatRoom: group.group_name, songs: songsFromStorage });
            socket.off('get-medias-group', getSongs);
            return dispatchCommon(songsFromStorage);

        }
        socket.off('get-medias-group', getSongs);
        return dispatchCommon(data.songs);
    }

    function getSong(data: any) {
        return dispatchContextSongs({
            type: 'set_added_song',
            value: {
                addedSong: data.song,
                isLoading: false,
                removedSong: null,
                votedSong: null,
                transformedSong: null
            }
        });
    }

    function getSongWithError(data: any) {
        return dispatchContextSongs({
            type: 'song_error',
            value: {
                transformedSong: data.song,
                addedSong: null,
                isLoading: false,
                removedSong: null,
                votedSong: null
            }
        });
    }

    function getRemovedSong(data: any) {
        return dispatchContextSongs({
            type: 'set_removed_song',
            value: {
                removedSong: data.song,
                isLoading: false,
                votedSong: null,
                addedSong: null
            }
        });
    }

    function getVotedSong(data: any) {
        return dispatchContextSongs({
            type: 'set_voted_song',
            value: {
                votedSong: data.song,
                isVotingSong: data.isVotingSong,
                isLoading: false,
                addedSong: null,
                removedSong: null,
                transformedSong: null
            }
        });
    }

    async function handleServerError() {
        const songsFromStorage = await getSongsFromStorageOrConvert() || [];

        return dispatchCommon(songsFromStorage);
    }

    if (isServerError && isLoading) {
        handleServerError();
    }

    const memoizedPlayerSongsListCallBack = useCallback(() => {
        if (songs && !songs.length) {
            return (<MediaListEmpty />);
        }

        return (
            <View style={{ flex: 1 }}>
                <View style={{ position: 'absolute', left: -15, top: -10, zIndex: 100 }}>
                    <CustomButton
                        btnStyle={{ width: 50, height: 50 }}
                        btnCustomStyle={{ backgroundColor: 'transparent' }}
                        shadow={{}}
                        btnIcon={<Icon
                            name='music-note'
                            type='FontAwesome'
                            color='#dd0031'
                            size={12}
                        />}
                        btnTitle={songs.length}
                        btnTitleStyle={{ color: '#666', fontSize: 12 }}
                        action={() => {
                            return navigation.navigate('SearchGroupSongScreen');
                        }}
                        // when pressed, should go to songs screen in order to search a song in the list
                    />
                </View>
                <MemoizedPlayerSongsList
                    data={songs}
                    buttonActions={['votes', 'remove']}
                />
            </View>
        );
    }, [songs.length, isServerError]);

    if (isLoading) {
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

    const resetLoadingSongs = (() => {
        let executed = false;
        return () => {
            if (!executed) {
                executed = true;
                // do something
                return dispatchContextSongs({ type: 'update_song_reset' });
            }
        };
    })();

    function renderSearchBar() {
        if (isServerError) {
            return null;
        }

        return (
            <SearchBarAutoComplete
                resetLoadingSongs={resetLoadingSongs}
                songs={songs}
                navigation={navigation}
            />
        );
    }

    console.log('Songs');

    return (
        <BodyContainer>
            { renderSearchBar()}
            { memoizedPlayerSongsListCallBack()}
        </BodyContainer>
    );
};

Songs.propTypes = {
    media: PropTypes.any,
    navigation: PropTypes.any,
    isServerError: PropTypes.bool
};

export default memo(Songs);
