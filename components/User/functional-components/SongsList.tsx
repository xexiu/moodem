import React, { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import CommonFlatList from '../../common/functional-components/CommonFlatList';
import Player from '../../common/Player';

const SongsList = forwardRef((props: any, ref: any) => {
    const songsListRef = ref;
    const {
        data,
        isComingFromSearchingSong,
        renderItem,
        isRemovingSong,
        isVoting
    } = props;
    const [allValues, setAllValues] = useState({
        currentSong: data.songs[0]
    });
    const basePlayer = useRef(null);
    const flatListRef = useRef(null);
    const repeatRef = useRef(null);
    const playPauseRef = useRef(null);
    const seekRef = useRef(null);

    const handlePressItem = useCallback((song: any) => {
        markCurrentSong(song);
        setAllValues((prevValues: any) => {
            return {
                ...prevValues,
                currentSong: song
            };
        });
    }, [allValues.currentSong, data]);

    useImperativeHandle(ref, () => {
        return {
            handlePressItem,
            setAllValues,
            currentSong: allValues.currentSong
        };
    }, [allValues.currentSong, setAllValues, data, handlePressItem]);

    const renderItemsCallBack = useCallback((params: any) => {
        return renderItem(params.item, () => {
            return handlePressItem(params.item);
        }, allValues.currentSong);
    }, [handlePressItem]);

    if (!data.songs.length) {
        allValues.currentSong = null;
        return <MediaListEmpty />;
    }

    function markCurrentSong(track: any) {
        if (track.id === allValues.currentSong.id) {
            return Object.assign(allValues.currentSong, {
                isPlaying: !track.isPlaying
            });
        }
        if (track.id !== allValues.currentSong.id) {
            Object.assign(data.songs[allValues.currentSong.id], {
                isPlaying: false
            });
            return Object.assign(data.songs[track.id], {
                isPlaying: !track.isPlaying
            });
        }
    }

    if (isComingFromSearchingSong && Object.keys(allValues.currentSong || {}).length || isRemovingSong || isVoting) {
        if (data.songs[allValues.currentSong.id]) {
            if (!isRemovingSong) {
                Object.assign(data.songs[allValues.currentSong.id], {
                    isPlaying: allValues.currentSong.isPlaying
                });
            }
        }
    } else if (isComingFromSearchingSong && !Object.keys(allValues.currentSong || {}).length) {
        setAllValues(prevValues => {
            return {
                ...prevValues,
                currentSong: data.songs[0]
            };
        });
    }

    function keyExtractor(item: any) {
        return item.id.toString();
    }

    return (
        <View style={{ flex: 1 }}>
            <Player
                repeatRef={repeatRef}
                playPauseRef={playPauseRef}
                currentSong={allValues.currentSong}
                songsListRef={songsListRef}
                basePlayer={basePlayer}
                seekRef={seekRef}
                songs={data.songs}
            />

            <CommonFlatList
                style={{ marginTop: 0 }}
                reference={flatListRef}
                data={data.songs}
                keyExtractor={keyExtractor}
                action={renderItemsCallBack}
            />
        </View>
    );
});

const areEqual = (prevProps: any, nextProps: any) => {
    if (nextProps.isSearching && !nextProps.isComingFromSearchingSong) {
        return true;
    }
    if (prevProps.data.songs !== nextProps.data.songs.length) {
        return false;
    }
    return false;
};

export default memo(SongsList, areEqual);
