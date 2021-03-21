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
        isSearching,
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
        extraData
    } = props;
    const [allValues, setAllValues] = useState({
        currentSong: {
            isPlaying: false
        },
        isPlayerReady: false
    }) as any;
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log('Use effect 1');
        if (tracks && tracks.length) {
            setAllValues((prevState: any) => {
                return {
                    ...prevState,
                    currentSong: tracks[0],
                    isPlayerReady: true
                };
            });
        } else {
            setAllValues((prevState: any) => {
                return {
                    ...prevState,
                    isPlayerReady: false
                };
            });
        }
    }, [tracks]);

    // useEffect(() => {
    //     console.log('Use effect 2');
    //     if (Object.keys(currentSong).length) {
    //         setCurrentSong({
    //             ...tracks[songIndex]
    //         });
    //     }
    // }, [songIndex]);

    // useEffect(() => {
    //     if (isSearching) {
    //         console.log('Comming from Search');
    //         setIsPlayerReady(true);
    //     } else if (isPlayerReady) {
    //         //console.log('Player Ready');
    //     } else {
    //         console.log('IsFocused Player');
    //         setIsPlayerReady(true);
    //         setCurrentSong({...tracks[0]});
    //     }
    // }, [!props.isSearching, currentSong]);

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

    const keyExtractor = (item: any) => item.index.toString();

    if (!allValues.isPlayerReady) {
        return (<MediaListEmpty />);
    }

    // console.log('Render Player Ready. Has Songs And Tracks');

    return (
        <BodyContainer>
            <SongInfoContainer>
                <PlayerControl
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
                />
                <PlayerControlPlayPause
                    ref={playPauseRef}
                    player={player}
                    basePlayer={basePlayer}
                    currentSong={allValues.currentSong}
                    tracks={tracks}
                    flatListRef={flatListRef}
                />
                <BasePlayer
                    repeatRef={repeatRef}
                    seekRef={seekRef}
                    playPauseRef={playPauseRef}
                    manageTrack={manageTrack}
                    currentSong={allValues.currentSong}
                    basePlayer={basePlayer}
                    tracks={tracks}
                />
                <PlayerControl
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
                />
            </SongInfoContainer>
            <CommonFlatList
                style={{ marginTop: 20 }}
                reference={flatListRef}
                data={tracks}
                extraData={extraData || tracks}
                keyExtractor={keyExtractor}
                action={({ item, index }) => {
                    // console.log('Render Item', item);
                    return renderItem(item, index, playPauseRef);
                }}
            />
            <Toast
                position='top'
                ref={media.toastRef}
            />
        </BodyContainer>
    );
});

const areEqual = (prevProps: any, nextProps: any) => {
    console.log('Player prev', prevProps, 'Next', nextProps);
    // if (prevProps.isSearching) {
    //     return false;
    // }
    // if (prevProps.tracks.length && nextProps.tracks.length) {
    //     console.log('PREVV PLAYER', prevProps, 'NExtt', nextProps);
    //     return false;
    // }

    return false;
};

export default memo(Player, areEqual);
