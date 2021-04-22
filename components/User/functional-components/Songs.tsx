
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
        saveOnLocalStorage(group.group_name, audios).then(() => dispatchCommon(audios));
    }

    function getSongs() {
        media.on('get-medias-group', (data: any) => {
            const savedItem = loadFromLocalStorage(group.group_name);

            savedItem
                .then((_data: any) => {
                    switch (_data) {
                    case 'NotFoundError':
                        if (!data.songs.length) {
                            if (group.group_videoIds && group.group_videoIds.length) {
                                media.socket.off('emit-medias-group');
                                media.socket.off('get-medias-group');
                                return convertVideosIdsCommon();
                            }
                        }
                        return dispatchCommon(data.songs);
                    case 'ExpiredError':
                        return '';
                    default:
                        if (!data.songs.length) {
                            media.emit('emit-set-medias', { chatRoom: group.group_name, songs: _data });
                            removeItem(group.group_name);
                        }
                        return dispatchCommon(_data);
                    }
                });
        });
    }

    function getSong() {
        media.on('song-added', (data: any) => {
            dispatchContextSongs({
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

    function getRemovedSong() {
        media.on('song-removed', (data: any) => {
            dispatchContextSongs({
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

    function getVotedSong() {
        media.on('song-voted', (data: any) => {
            dispatchContextSongs({
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
            media.socket.off('emit-medias-group');
            media.socket.off('get-medias-group');
            convertVideosIdsCommon();
        });
    }

    if (isServerError && isLoading) {
        const savedItem = loadFromLocalStorage(group.group_name);

        savedItem.then((data) => {
            switch (data) {
            case 'NotFoundError':
                media.socket.off('emit-medias-group');
                media.socket.off('get-medias-group');
                return convertVideosIdsCommon();
            case 'ExpiredError':
                return '';
            default:
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
            console.log('OFF EFFECTS SONGS');
            media.socket.off('emit-medias-group');
            media.socket.off('get-medias-group');
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

    function renderPlayer() {
        if (songs && !songs.length) {
            return (<MediaListEmpty />);
        }
        return (
            <MemoizedPlayerSongsList
                data={songs}
                media={media}
                buttonActions={isServerError ? [] : ['votes', 'remove']}
            />
        );
    }

    function renderSearchBar() {
        if (isServerError || isSongError) {
            return null;
        }

        return (
            <SearchBarAutoComplete
                    group={group}
                    songsOnGroup={songs}
                    navigation={navigation}
                    media={media}
                />
        );
    }

    return (
        <BodyContainer>
            { renderSearchBar() }
            { renderPlayer()}
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
