
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect } from 'react';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import { loadFromLocalStorage, removeItem, saveOnLocalStorage } from '../../../src/js/Utils/common/storageConfig';
import { convertVideoIdsFromDB, setExtraAttrs } from '../../../src/js/Utils/Helpers/actions/songs';
import BodyContainer from '../../common/functional-components/BodyContainer';
import MemoizedPlayerSongsList from '../../common/functional-components/MemoizedPlayerSongsList';
import PreLoader from '../../common/functional-components/PreLoader';
import SearchBarAutoComplete from '../../common/functional-components/SearchBarAutoComplete';
import { AppContext } from '../store-context/AppContext';
import { SongsContext } from '../store-context/SongsContext';

const Songs = (props: any) => {
    const { media, navigation } = props;
    const { group, user, isServerError } = useContext(AppContext) as any;
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
        media.emit('emit-set-medias', { chatRoom: group.group_name, songs: audios });
        saveOnLocalStorage(group.group_name, audios).then(() => dispatchCommon(audios));
    }

    async function getSongs() {
        await media.on('get-medias-group', (data: any) => {
            media.socket.off('get-medias-group', getSongs);

            const groupVideoIds = group.group_videoIds && group.group_videoIds.length;

            if (data.songs.length !== groupVideoIds) {
                if (groupVideoIds) {
                    removeItem(group.group_name);
                    return convertVideosIdsCommon();
                }
            }
            return dispatchCommon(data.songs);
        });
    }

    async function getSong() {
        await media.on('song-added', (data: any) => {
            media.socket.off('song-added', getSong);
            return dispatchContextSongs({
                type: 'set_added_song',
                value: {
                    addedSong: data.song,
                    isLoading: false,
                    removedSong: null,
                    votedSong: null
                }
            });
        });
    }

    async function getRemovedSong() {
        await media.on('song-removed', (data: any) => {
            media.socket.off('song-removed', getRemovedSong);
            return dispatchContextSongs({
                type: 'set_removed_song',
                value: {
                    removedSong: data.song,
                    isLoading: false,
                    votedSong: null,
                    addedSong: null
                }
            });
        });
    }

    async function getVotedSong() {
        await media.on('song-voted', (data: any) => {
            media.socket.off('song-voted', getVotedSong);
            return dispatchContextSongs({
                type: 'set_voted_song',
                value: {
                    votedSong: data.song,
                    isLoading: false,
                    addedSong: null,
                    removedSong: null
                }
            });
        });
    }

    if (isSongError) {
        removeItem(group.group_name, () => {
            media.socket.off('get-medias-group', getSongs);
            convertVideosIdsCommon();
        });
    }

    if (isServerError && isLoading) {
        const savedItem = loadFromLocalStorage(group.group_name);

        savedItem.then((data) => {
            switch (data) {
            case 'NotFoundError':
                media.socket.off('get-medias-group', getSongs);
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
            getSongs();
            getSong();
            getRemovedSong();
            getVotedSong();
            media.emit('emit-medias-group', { chatRoom: group.group_name });
        }

        return () => {
            media.socket.off('get-medias-group', getSongs);
        };
    }, []);

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

    function resetLoadingSongs() {
        return dispatchContextSongs({ type: 'update_song_reset' });
    }

    function renderPlayerSongsList() {
        if (songs && !songs.length) {
            return (<MediaListEmpty />);
        }

        return (
            <MemoizedPlayerSongsList
                data={songs}
                media={media}
                buttonActions={(isServerError || isSongError) ? [] : ['votes', 'remove']}
            />
        );
    }

    function renderSearchBar() {
        if (isServerError || isSongError) {
            return null;
        }

        return (
            <SearchBarAutoComplete
                resetLoadingSongs={resetLoadingSongs}
                songs={songs}
                navigation={navigation}
                media={media}
            />
        );
    }

    return (
        <BodyContainer>
            { renderSearchBar()}
            { renderPlayerSongsList()}
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
