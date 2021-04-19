
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect } from 'react';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import BodyContainer from '../../common/functional-components/BodyContainer';
import MemoizedPlayerSongsList from '../../common/functional-components/MemoizedPlayerSongsList';
import PreLoader from '../../common/functional-components/PreLoader';
import SearchBarAutoComplete from '../../common/functional-components/SearchBarAutoComplete';
import { AppContext } from '../store-context/AppContext';
import { SongsContext } from '../store-context/SongsContext';

const Songs = (props: any) => {
    const { media, navigation, isServerError } = props;
    const { group } = useContext(AppContext) as any;
    const {
        dispatch,
        songs,
        isLoading
    } = useContext(SongsContext) as any;

    function getSongs() {
        media.on('get-medias-group', (data: any) => {
            dispatch({
                type: 'set_songs',
                value: {
                    songs: [...data.songs],
                    isLoading: false,
                    removedSong: null,
                    votedSong: null,
                    addedSong: null
                }
            });
        });
    }

    function getSong() {
        media.on('song-added', (data: any) => {
            dispatch({
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
            dispatch({
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
            dispatch({
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

    if (isLoading && !isServerError) {
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
                buttonActions={['votes', 'remove']}
            />
        );
    }

    return (
        <BodyContainer>
            <SearchBarAutoComplete
                group={group}
                songsOnGroup={songs}
                navigation={navigation}
                media={media}
            />
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
