/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react';
import { Text } from 'react-native';
import Toast from 'react-native-easy-toast';
import { MediaListEmpty } from '../../screens/User/functional-components/MediaListEmpty';
import BodyContainer from '../common/functional-components/BodyContainer';
import CommonFlatList from '../common/functional-components/CommonFlatList';
import PlayerControlPlayPause from '../common/PlayerControlPlayPause';
import PlayerControlRepeat from '../common/PlayerControlRepeat';
import PlayerControlTimeSeek from '../common/PlayerControlTimeSeek';
import { SongInfoContainer } from '../common/SongInfoContainer';
import SongInfoTitle from '../common/SongInfoTitle';
import Song from '../User/functional-components/Song';
import BasePlayer from './BasePlayer';
import PlayerControl from './PlayerControl';

const Player = forwardRef((props: any, ref: any) => {
    const {
        isComingFromSearchingSong,
        isSearching,
        isRemovingSong,
        navigation,
        basePlayer,
        seekRef,
        playPauseRef,
        repeatRef,
        flatListRef,
        player,
        renderItem,
        media,
        tracks,
        extraData,
        children
    } = props;
    const [allValues, setAllValues] = useState({
        currentSong: tracks[0],
        isPlayerReady: false
    }) as any;
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && tracks.length) {
            setAllValues(prevValues => {
                return {
                    ...prevValues,
                    currentSong: tracks[0],
                    isPlayerReady: true
                };
            });
        }
    }, [isFocused]);

    useImperativeHandle(ref, () => {
        return {
            setAllValues,
            currentSong: allValues.currentSong,
            markCurrentSong
        };
    }, [allValues.currentSong]);

    const handleOnPressNextPrev = (track: any) => {
        markCurrentSong(track);
        setIsPlayingPaused(track);
    };

    const markCurrentSong = (track: any) => {
        // tslint:disable-next-line:max-line-length
        // all songs props should be updated on this.tracks in order to be updated also on FlatList data (this.state.tracks)
        if (track.index === allValues.currentSong.index) {
            // update is playing
            // tslint:disable-next-line:prefer-object-spread
            return Object.assign(tracks[track.index], {
                isPlaying: !track.isPlaying
            });
        }
        if (track.index !== allValues.currentSong.index) {
            // tslint:disable-next-line:prefer-object-spread
            Object.assign(tracks[allValues.currentSong.index], {
                isPlaying: false
            });

            // tslint:disable-next-line:prefer-object-spread
            return Object.assign(tracks[track.index], {
                isPlaying: !track.isPlaying
            });
        }
    };

    const setIsPlayingPaused = (track: any) => { // should MarkCurrentSong before setIsPlayingPaused
        return setAllValues(prev => {
            return {
                ...prev,
                currentSong: track
            };
        });
    };

    const manageTrack = (track: any, shouldRepeat: boolean) => {
        if (shouldRepeat) {
            return setIsPlayingPaused(track);
        }
        const nextPrevIndex = tracks.length ? track.index + 1 : 0;

        if (tracks[nextPrevIndex]) {
            markCurrentSong(tracks[nextPrevIndex]);
            setIsPlayingPaused(tracks[nextPrevIndex]);
        } else {
            markCurrentSong(track);
            setIsPlayingPaused(track);
        }
    };

    if (!allValues.isPlayerReady || !tracks.length) {
        return null;
    }

    console.log('Render Player Ready. Has Songs And Tracks');

    return (
        <BodyContainer>
            <SongInfoContainer>
                {/* <PlayerControl
                    iconStyle={{
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#eee',
                        padding: 10,
                        borderRadius: 20,
                        width: 40
                    }}
                    iconType='font-awesome'
                    iconSize={18}
                    action='prev'
                    iconName='step-backward'
                    containerStyle={{ position: 'absolute', top: 20, left: 70, zIndex: 100 }}
                    nextPrevSong={allValues.currentSong.index - 1}
                    currentSong={allValues.currentSong}
                    tracks={tracks}
                    onPressHandler={(track: any) => {
                        handleOnPressNextPrev(track);
                    }}
                />
                <PlayerControlRepeat
                    ref={repeatRef}
                    iconStyle={{ borderWidth: 1, borderColor: '#eee', borderRadius: 15, padding: 2, backgroundColor: '#fff' }}
                    action='shouldRepeat'
                    containerStyle={{ position: 'absolute', top: 70, left: 115, zIndex: 100 }}
                /> */}
                {/* <PlayerControlPlayPause
                    isSearching={isSearching}
                    ref={playPauseRef}
                    player={player}
                    seekRef={seekRef}
                    basePlayer={basePlayer}
                    currentSong={allValues.currentSong}
                    tracks={tracks}
                    flatListRef={flatListRef}
                    isComingFromSearchingSong={isComingFromSearchingSong}
                    isRemovingSong={isRemovingSong}
                /> */}
                {/* <BasePlayer
                    repeatRef={repeatRef}
                    seekRef={seekRef}
                    playPauseRef={playPauseRef}
                    manageTrack={manageTrack}
                    currentSong={allValues.currentSong}
                    basePlayer={basePlayer}
                    tracks={tracks}
                /> */}
                {/* <PlayerControl
                    iconStyle={{
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#eee',
                        padding: 10,
                        borderRadius: 20,
                        width: 40
                    }}
                    iconType='font-awesome'
                    iconSize={18}
                    action='next'
                    iconName='step-forward'
                    containerStyle={{ position: 'absolute', top: 20, right: 60, zIndex: 100 }}
                    nextPrevSong={allValues.currentSong.index + 1}
                    currentSong={allValues.currentSong}
                    tracks={tracks}
                    onPressHandler={(track: any) => {
                        handleOnPressNextPrev(track);
                    }}
                />
                <PlayerControl
                    iconStyle={{ borderWidth: 1, borderColor: '#eee', borderRadius: 15, padding: 5, backgroundColor: '#fff' }}
                    iconType='entypo'
                    iconSize={18}
                    action='full-screen'
                    iconName='resize-full-screen'
                    containerStyle={{ position: 'absolute', top: 70, right: 115, zIndex: 100 }}
                    currentSong={allValues.currentSong}
                    tracks={tracks}
                    onPressHandler={() => {
                        basePlayer.current.presentFullscreenPlayer();
                    }}
                />
                <SongInfoTitle songTitle={allValues.currentSong.videoDetails.title} />
                <PlayerControlTimeSeek
                    ref={seekRef}
                    basePlayer={basePlayer}
                    currentSong={allValues.currentSong}
                /> */}
            </SongInfoContainer>
            {/* <CommonFlatList
                style={{ marginTop: 20 }}
                reference={flatListRef}
                data={tracks}
                extraData={extraData || tracks}
                keyExtractor={keyExtractor}
                action={(params) => {
                    // console.log('Render Item');
                    return renderItem(params, allValues.currentSong);
                }}
            /> */}
            <Toast
                position='top'
                ref={media.toastRef}
            />
        </BodyContainer>
    );
});

const areEqual = (prevProps: any, nextProps: any) => {
    //console.log('PREVV PLAYER', prevProps, 'NExtt', nextProps);
    // if (prevProps.tracks.length !== nextProps.tracks.length) {
    //     console.log('PREVV PLAYER 1', prevProps, 'NExtt', nextProps);
    //     return false;
    // } else if (nextProps.isSearching === !prevProps.isSearching) {
    //     console.log('PREVV PLAYER 2', prevProps, 'NExtt', nextProps);
    //     return false;
    // } else if (nextProps.isSearching) {
    //     console.log('PREVV PLAYER 3', prevProps, 'NExtt', nextProps);
    //     return true;
    // } else if (!prevProps.isSearching) {
    //     console.log('PREVV PLAYER 4', prevProps, 'NExtt', nextProps);
    //     return true;
    // }

    if (nextProps.isRemovingSong || nextProps.isComingFromSearchingSong) {
        return true;
    }

    if (prevProps.tracks.length !== nextProps.tracks.length) {
        console.log('PREVV PLAYER 1', prevProps, 'NExtt', nextProps);
        return false;
    }

    return true;
};

export default memo(Player, areEqual);
