
import React, { memo, useCallback, useContext, useEffect, useRef } from 'react';
import Toast from 'react-native-easy-toast';
import MediaListEmpty from '../../../screens/User/functional-components/MediaListEmpty';
import { updateSongExpiredOnDB } from '../../../src/js/Utils/Helpers/actions/songs';
import BodyContainer from '../../common/functional-components/BodyContainer';
import MemoizedSongsList from '../../common/functional-components/MemoizedSongsList';
import Player from '../../common/functional-components/Player';
import PreLoader from '../../common/functional-components/PreLoader';
import SearchBarAutoComplete from '../../common/functional-components/SearchBarAutoComplete';
import { AppContext } from '../store-context/AppContext';
import { SongsContext } from '../store-context/SongsContext';

let lastDataLength = 0;

const Songs = (props: any) => {
    const { navigation } = props;
    const { group, isServerError, socket, user } = useContext(AppContext) as any;
    const {
        dispatchContextSongs,
        songs,
        isLoading,
        indexItem
    } = useContext(SongsContext) as any;
    const toastRef = useRef() as any;
    const flatListRef = useRef() as any;

    useEffect(() => {
        MAP_SONGS_ACTIONS.set_songs(group.group_songs);

        if (!isServerError) {
            socket.emit('emit-message-welcomeMsg', {
                chatRoom: `GroupId_${group.group_id}_GroupName_${group.group_name}`
            });
            socket.on('get-message-welcomeMsg', getWelcomeMsg);
            socket.on('song-added', getSong);
            socket.on('song-removed', getRemovedSong);
            socket.on('song-voted', getVotedSong);
            socket.on('song-error', getSongWithError);
        }

        return () => {
            console.log('OFF SONGS');
            socket.off('emit-message-welcomeMsg', getWelcomeMsg);
            socket.off('get-message-welcomeMsg', getWelcomeMsg);
            socket.off('send-song-error', getSongWithError);
            socket.off('song-error', getSongWithError);
        };
    }, []);

    const commonDispatch = useCallback((action: string, song: any) => {
        return dispatchContextSongs({
            type: action,
            value: {
                songToTransform: song
            }
        });
    }, []);

    function setSongs(_songs: any) {
        return dispatchContextSongs({
            type: 'set_songs',
            value: {
                songs: [..._songs],
                isLoading: false,
                songToTransform: null
            }
        });
    }

    const MAP_SONGS_ACTIONS = {
        set_songs: setSongs,
        set_added_song: commonDispatch,
        set_removed_song: commonDispatch,
        set_voted_song: commonDispatch,
        song_error: commonDispatch,
        update_song_click_play_pause: useCallback((index) => {
            return dispatchContextSongs({
                type: 'update_song_click_play_pause',
                value: {
                    indexItem: index,
                    index,
                    songToTransform: null
                }
            });
        }, [])
    };

    function getWelcomeMsg({ welcomeMsg }: any) {
        toastRef.current.show(welcomeMsg, 1000);
    }

    function getSong({ song }: any) {
        return MAP_SONGS_ACTIONS.set_added_song('set_added_song', song);
    }

    async function getSongWithError({ song }: any) {
        await updateSongExpiredOnDB(song, group);
        return MAP_SONGS_ACTIONS.song_error('song_error', song);
    }

    function getRemovedSong({ song }: any) {
        return MAP_SONGS_ACTIONS.set_removed_song('set_removed_song', song);
    }

    function getVotedSong({ song }: any) {
        return MAP_SONGS_ACTIONS.set_voted_song('set_voted_song', song);
    }

    function onClickUseCallBack(index: number) {
        return MAP_SONGS_ACTIONS.update_song_click_play_pause(index);
    }

    function checkSizeChangeHandler(w: number, h: number) {
        const newLength = songs.length;
        const lastSong = songs[songs.length - 1];

        if (newLength > lastDataLength && lastDataLength) {
            if (lastSong.user.uid === user.uid) {
                return flatListRef.current.scrollToEnd({ animated: true });
            }
        }
        lastDataLength = newLength;
    }

    const memoizedPlayerSongsListCallBack = useCallback(() => {
        if (songs && !songs.length) {
            return (<MediaListEmpty />);
        }

        return (
            <BodyContainer>
                <Player
                    isPlaying={songs[indexItem].isPlaying}
                    item={songs[indexItem]}
                    handleOnClickItem={onClickUseCallBack}
                    items={songs}
                    indexItem={indexItem}
                />
                <MemoizedSongsList
                    reference={flatListRef}
                    checkSizeChangeHandler={checkSizeChangeHandler}
                    data={songs}
                    buttonActions={['votes', 'remove']}
                    indexItem={indexItem}
                    handleOnClickItem={onClickUseCallBack}
                />
            </BodyContainer>
        );
    }, [songs, indexItem]);

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

    function renderSearchBar() {
        if (isServerError) {
            return null;
        }

        return (
            <SearchBarAutoComplete
                songs={songs}
                navigation={navigation}
            />
        );
    }

    return (
        <BodyContainer>
            {renderSearchBar()}
            {memoizedPlayerSongsListCallBack()}
            <Toast
                position={isServerError ? 'bottom' : 'top'}
                ref={toastRef}
            />
        </BodyContainer>
    );
};

export default memo(Songs);
