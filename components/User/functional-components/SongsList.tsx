import { useIsFocused } from '@react-navigation/native';
import React, { forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import BasePlayer from '../../common/BasePlayer';
import CommonFlatList from '../../common/functional-components/CommonFlatList';
import PlayerControlPlayPause from '../../common/PlayerControlPlayPause';
import PlayerControlRepeat from '../../common/PlayerControlRepeat';
import PlayerControlTimeSeek from '../../common/PlayerControlTimeSeek';
import { SongInfoContainer } from '../../common/SongInfoContainer';
import Song from './Song';

const SongsList = forwardRef((props: any, ref: any) => {
    const songsListRef = ref;
    const {
        isSearching,
        data,
        isComingFromSearchingSong,
        renderItem
    } = props;
    const [allValues, setAllValues] = useState({
        currentSong: data.songs[0]
    });
    const basePlayer = useRef(null);
    const flatListRef = useRef(null);
    const repeatRef = useRef(null);
    const playPauseRef = useRef(null);
    const seekRef = useRef(null);

    useImperativeHandle(ref, () => {
        return {
            setAllValues,
            currentSong: allValues.currentSong
        };
    }, [allValues.currentSong, setAllValues, data]);

    const handlePressItem = useCallback((song: any) => {
        markCurrentSong(song);
        setAllValues(prevValues => {
            return {
                ...prevValues,
                currentSong: song
            };
        });
    }, [allValues.currentSong, data]);

    const renderItemsCallBack = useCallback((params: any) => {
        return renderItem(params.item, handlePressItem, allValues.currentSong);
    }, [handlePressItem]);

    if (!data.songs.length || !Object.keys(allValues.currentSong).length) {
        return <MediaListEmpty />;
    }

    function markCurrentSong(track: any) {
        // tslint:disable-next-line:max-line-length
        // all songs props should be updated on this.tracks in order to be updated also on FlatList data (this.state.tracks)
        // console.log('CurentSong Pressed', allValues.currentSong.id);
        if (track.id === allValues.currentSong.id) {
            // update is playing
            // tslint:disable-next-line:prefer-object-spread
            return Object.assign(data.songs[track.id], {
                isPlaying: !track.isPlaying
            });
        }
        if (track.id !== allValues.currentSong.id) {
            // tslint:disable-next-line:prefer-object-spread
            Object.assign(data.songs[allValues.currentSong.id], {
                isPlaying: false
            });

            // tslint:disable-next-line:prefer-object-spread
            return Object.assign(data.songs[track.id], {
                isPlaying: !track.isPlaying
            });
        }
    }

    if (isComingFromSearchingSong && Object.keys(allValues.currentSong).length) {
        Object.assign(data.songs[allValues.currentSong.id], {
            isPlaying: allValues.currentSong.isPlaying
        });
    } else if (isComingFromSearchingSong && !Object.keys(allValues.currentSong).length) {
        setAllValues(prevValues => {
            return {
                ...prevValues,
                currentSong: data.songs[0]
            };
        });
    }

    function headerPlayer() {
        return (
            <SongInfoContainer>
                <PlayerControlRepeat
                    ref={repeatRef}
                    iconStyle={{ borderWidth: 1, borderColor: '#eee', borderRadius: 15, padding: 2, backgroundColor: '#fff' }}
                    action='shouldRepeat'
                    containerStyle={{ position: 'absolute', top: 70, left: 115, zIndex: 100 }}
                />
                <PlayerControlPlayPause
                    ref={playPauseRef}
                    currentSong={allValues.currentSong}
                    songsListRef={songsListRef}
                />
                <BasePlayer
                    repeatRef={repeatRef}
                    basePlayer={basePlayer}
                    seekRef={seekRef}
                    playPauseRef={playPauseRef}
                    // // manageTrack={manageTrack}
                    currentSong={allValues.currentSong}
                    // basePlayer={basePlayer}
                    // songs={data.songs}
                    songsListRef={songsListRef}
                // isComingFromSearchingSong={isComingFromSearchingSong}
                />
                <PlayerControlTimeSeek
                    ref={seekRef}
                    basePlayer={basePlayer}
                    currentSong={allValues.currentSong}
                />
            </SongInfoContainer>
        );
    }

    function keyExtractor(item: any) {
        return item.videoDetails.videoId;
    }

    return (
        <View style={{ flex: 1 }}>
            {headerPlayer()}

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

export default memo(SongsList);
