
import PropTypes from 'prop-types';
import React, { memo, useCallback, useContext, useEffect } from 'react';
import MediaListEmpty from '../../../screens/User/functional-components/MediaListEmpty';
import { loadFromLocalStorage, removeItem, saveOnLocalStorage } from '../../../src/js/Utils/common/storageConfig';
import { convertVideoIdsFromDB, setExtraAttrs } from '../../../src/js/Utils/Helpers/actions/songs';
import BodyContainer from '../../common/functional-components/BodyContainer';
import MemoizedPlayerSongsList from '../../common/functional-components/MemoizedPlayerSongsList';
import PreLoader from '../../common/functional-components/PreLoader';
import SearchBarAutoComplete from '../../common/functional-components/SearchBarAutoComplete';
import { AppContext } from '../store-context/AppContext';
import { SongsContext } from '../store-context/SongsContext';

const Songs = (props: any) => {
    const { navigation } = props;
    const { group, user, isServerError, socket } = useContext(AppContext) as any;
    const {
        dispatchContextSongs,
        songs,
        isLoading,
        isSongError
    } = useContext(SongsContext) as any;

    function dispatchCommon(data: any) {
        return dispatchContextSongs({
            type: 'set_songs',
            value: {
                songs: [...data],
                isLoading: false,
                isSongError: false,
                removedSong: null,
                votedSong: null,
                addedSong: null
            }
        });
    }

    async function convertVideosIdsCommon() {
        const audios = await convertVideoIdsFromDB(group.group_videoIds);
        setExtraAttrs(audios, user.uid);
        socket.emit('emit-set-medias', { chatRoom: group.group_name, songs: audios });
        saveOnLocalStorage(group.group_name, audios).then(() => dispatchCommon(audios));
    }

    function getSongs(data: any) {
        const groupVideoIds = group.group_videoIds && group.group_videoIds.length;

        if (data.songs.length !== groupVideoIds) {
            removeItem(group.group_name);
            return convertVideosIdsCommon();
        }
        return dispatchCommon(data.songs);
    }

    function getSong(data: any) {
        return dispatchContextSongs({
            type: 'set_added_song',
            value: {
                addedSong: data.song,
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
                removedSong: null
            }
        });
    }

    if (isSongError) {
        removeItem(group.group_name, () => {
            socket.socket.off('get-medias-group', getSongs);
            convertVideosIdsCommon();
        });
    }

    if (isServerError && isLoading) {
        const savedItem = loadFromLocalStorage(group.group_name);

        savedItem.then((data) => {
            switch (data) {
            case 'NotFoundError':
                socket.socket.off('get-medias-group', getSongs);
                return convertVideosIdsCommon();
            case 'ExpiredError':
                return convertVideosIdsCommon();
            default:
                if (data.length !== (group.group_videoIds && group.group_videoIds.length)) {
                    return convertVideosIdsCommon();
                }
                return dispatchCommon(data);
            }
        });
    }

    useEffect(() => {
        if (!isServerError) {
            socket.on('get-medias-group', getSongs);
            socket.on('song-added', getSong);
            socket.on('song-removed', getRemovedSong);
            socket.on('song-voted', getVotedSong);
            socket.emit('emit-medias-group', { chatRoom: group.group_name });
        }

        return () => {
            socket.off('get-medias-group', getSongs);
        };
    }, []);

    const memoizedPlayerSongsListCallBack = useCallback(() => {
        if (songs && !songs.length) {
            return (<MediaListEmpty />);
        }

        return (
            <MemoizedPlayerSongsList
                data={songs}
                buttonActions={(isServerError || isSongError) ? [] : ['votes', 'remove']}
            />
        );
    }, [songs]);

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
        if (isServerError || isSongError) {
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

    console.log('SONGS');

    return (
        <BodyContainer>
            { renderSearchBar() }
            { memoizedPlayerSongsListCallBack() }
        </BodyContainer>
    );
};

Songs.propTypes = {
    media: PropTypes.any,
    navigation: PropTypes.any,
    isServerError: PropTypes.bool
};

Songs.defaultProps = {
    isServerError: false
};

export default memo(Songs);
