
import PropTypes from 'prop-types';
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

const Songs = (props: any) => {
    const { navigation } = props;
    const { group, isServerError, socket, user } = useContext(AppContext) as any;
    const {
        dispatchContextSongs,
        songs,
        isLoading,
        indexItem
    } = useContext(SongsContext) as any;
    const toastRef = useRef(null);

    useEffect(() => {
        dispatchCommon(group.group_songs);

        if (!isServerError) {
            socket.emit('emit-set-medias', { chatRoom: group.group_name, songs: group.group_songs });
            socket.emit('emit-message-welcomeMsg', { chatRoom: group.group_name });
            socket.on('get-message-welcomeMsg', getWelcomeMsg);
            socket.on('song-added', getSong);
            socket.on('song-removed', getRemovedSong);
            socket.on('song-voted', getVotedSong);
            socket.on('song-error', getSongWithError);
        }

        return () => {
            console.log('OFF SONGS');
            socket.off('emit-message-welcomeMsg');
            socket.off('get-message-welcomeMsg');
            socket.off('emit-set-medias');
            socket.off('send-song-error', getSongWithError);
            socket.off('song-error', getSongWithError);
        };
    }, []);

    function getWelcomeMsg({ welcomeMsg }: any) {
        toastRef.current.show(welcomeMsg, 1000);
    }

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

    function getSong({ song }: any) {
        return dispatchContextSongs({
            type: 'set_added_song',
            value: {
                addedSong: song,
                isLoading: false,
                removedSong: null,
                votedSong: null,
                transformedSong: null
            }
        });
    }

    function getSongWithError({ song }: any) {
        return updateSongExpiredOnDB(song, user, group.group_name, () => {
            return dispatchContextSongs({
                type: 'song_error',
                value: {
                    transformedSong: song,
                    addedSong: null,
                    isLoading: false,
                    removedSong: null,
                    votedSong: null
                }
            });
        });
    }

    function getRemovedSong({ song }: any) {
        return dispatchContextSongs({
            type: 'set_removed_song',
            value: {
                removedSong: song,
                isLoading: false,
                votedSong: null,
                addedSong: null,
                transformedSong: null
            }
        });
    }

    function getVotedSong({ song }: any) {
        return dispatchContextSongs({
            type: 'set_voted_song',
            value: {
                votedSong: song,
                isLoading: false,
                addedSong: null,
                removedSong: null,
                transformedSong: null
            }
        });
    }

    const resetLoadingSongs = useCallback((() => {
        let executed = false;
        return () => {
            if (!executed) {
                executed = true;
                return dispatchContextSongs({ type: 'update_song_reset' });
            }
        };
    })(), []);

    const onClickUseCallBack = useCallback((index: number) => dispatchContextSongs({
        type: 'update_song_click_play_pause',
        value: {
            indexItem: index,
            index,
            removedSong: null,
            votedSong: null,
            addedSong: null,
            transformedSong: null
        }
    }), []);

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
                resetLoadingSongs={resetLoadingSongs}
                songs={songs}
                navigation={navigation}
            />
        );
    }

    return (
        <BodyContainer>
            { renderSearchBar()}
            { memoizedPlayerSongsListCallBack()}
            <Toast
                position={isServerError ? 'bottom' : 'top'}
                ref={toastRef}
            />
        </BodyContainer>
    );
};

Songs.propTypes = {
    media: PropTypes.any,
    navigation: PropTypes.any,
    isServerError: PropTypes.bool
};

export default memo(Songs);
