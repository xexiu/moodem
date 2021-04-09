
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import BodyContainer from '../../common/functional-components/BodyContainer';
import MemoizedItems from '../../common/functional-components/MemoizedItems';
import Player from '../../common/functional-components/Player';
import PreLoader from '../../common/functional-components/PreLoader';
import SearchBarAutoComplete from '../../common/functional-components/SearchBarAutoComplete';
import { AppContext } from '../../User/functional-components/AppContext';

const Songs = (props: any) => {
    const { media, navigation, isServerError } = props;
    const { group } = useContext(AppContext) as any;
    const [allValues, setAllValues] = useState({
        songs: [],
        indexItem: 0,
        isLoading: true,
        isComingFromSearchingSong: false,
        isRemovingSong: false,
        isVoting: false
    });
    const basePlayer = useRef(null);
    const repeatRef = useRef(null);
    const playPauseRef = useRef(null);
    const seekRef = useRef(null);

    function getSongs() {
        media.on('get-medias-group', (data: any) => {
            setAllValues((prev: any) => {
                return {
                    ...prev,
                    songs: [...data.songs],
                    isLoading: false,
                    isComingFromSearchingSong: data.isComingFromSearchingSong || false,
                    isRemovingSong: data.isRemovingSong || false,
                    isVoting: data.isVoting || false
                };
            });
        });
    }

    function getRemovedSong() {
        media.on('song-removed', (data: any) => {
            setAllValues(prev => {
                if (prev.songs[data.song.id]) {
                    prev.songs.splice(data.song.id, 1);
                    prev.songs.forEach((song: any, index: number) => Object.assign(song, { id: index }));
                }
                return {
                    ...prev,
                    songs: [...prev.songs],
                    indexItem: prev.indexItem >= data.song.id && prev.songs.length ?
                        prev.indexItem - 1 :
                        prev.indexItem,
                    isRemovingSong: data.isRemovingSong || false
                };
            });

        });
    }

    useEffect(() => {
        getSongs();
        getRemovedSong();
        media.emit('emit-medias-group', { chatRoom: group.group_name });

        return () => {
            // media.destroy();
            console.log('OFF EFFECTS SONGS');
            media.socket.off('emit-medias-group');
            media.socket.off('get-medias-group');
            media.socket.off('song-removed');
        };
    }, []);

    const onClickUseCallBack = useCallback((index: number) => {
        setAllValues((prev: any) => {
            if (prev.songs && prev.songs.length) {
                if (prev.indexItem === index) {
                    prev.songs[index].isPlaying = !prev.songs[index].isPlaying;
                } else {
                    if (prev.songs[prev.indexItem]) {
                        prev.songs[prev.indexItem].isPlaying = false;
                    }
                    prev.songs[index].isPlaying = !prev.songs[index].isPlaying;
                }
            }
            return {
                ...prev,
                indexItem: index,
                songs: [...prev.songs]
            };
        });
    }, []);

    if (allValues.isLoading && !isServerError) {
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

    const resetLoadingSongs = (loading: boolean) => {
        setAllValues((prev: any) => {
            return {
                ...prev,
                isLoading: loading
            };
        });
    };

    const setIsGoingToSearching = (isSearching: boolean) => {
        setAllValues((prev: any) => {
            return {
                ...prev,
                isSearching
            };
        });
    };

    console.log('songs updated');

    function renderPlayer() {
        if (allValues.songs && !allValues.songs.length) {
            return (<MediaListEmpty />);
        }
        return (
            <View style={{ flex: 1 }}>
                <Player
                    repeatRef={repeatRef}
                    playPauseRef={playPauseRef}
                    basePlayer={basePlayer}
                    seekRef={seekRef}
                    isPlaying={allValues.songs[allValues.indexItem].isPlaying}
                    item={allValues.songs[allValues.indexItem]}
                    onClick={onClickUseCallBack}
                    items={allValues.songs}
                />
                <MemoizedItems
                    data={allValues.songs}
                    onClick={onClickUseCallBack}
                    media={media}
                />
            </View>
        );
    }

    return (
        <BodyContainer>
            <SearchBarAutoComplete
                group={group}
                songsOnGroup={allValues.songs}
                navigation={navigation}
                media={media}
                resetLoadingSongs={resetLoadingSongs}
                setIsGoingToSearching={setIsGoingToSearching}
            />
            { renderPlayer() }
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
