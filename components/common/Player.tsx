import React, { memo } from 'react';
import BasePlayer from '../common/BasePlayer';
import PlayerControlPlayPause from '../common/PlayerControlPlayPause';
import PlayerControlRepeat from '../common/PlayerControlRepeat';
import PlayerControlTimeSeek from '../common/PlayerControlTimeSeek';
import { SongInfoContainer } from '../common/SongInfoContainer';
import SongInfoTitle from '../common/SongInfoTitle';
import PlayerControl from './PlayerControl';

const Player = (props: any) => {
    const {
        repeatRef,
        playPauseRef,
        currentSong,
        songsListRef,
        basePlayer,
        seekRef,
        songs
    } = props;

    return (
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
                nextPrevSong={currentSong.id - 1}
                currentSong={currentSong}
                songs={songs}
                onPressHandler={(song: any) => {
                    return songsListRef.current.handlePressItem(song);
                }}
            />
            <PlayerControlRepeat
                ref={repeatRef}
                iconStyle={{
                    borderWidth: 1,
                    borderColor: '#eee',
                    borderRadius: 15,
                    padding: 2,
                    backgroundColor: '#fff'
                }}
                action='shouldRepeat'
                containerStyle={{ position: 'absolute', top: 70, left: 120, zIndex: 100 }}
            />
            <PlayerControlPlayPause
                ref={playPauseRef}
                currentSong={currentSong}
                songsListRef={songsListRef}
                onPressHandler={(song: any) => {
                    return songsListRef.current.handlePressItem(currentSong);
                }}
            />
            <BasePlayer
                repeatRef={repeatRef}
                basePlayer={basePlayer}
                seekRef={seekRef}
                playPauseRef={playPauseRef}
                currentSong={currentSong}
                songs={songs}
                songsListRef={songsListRef}
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
                containerStyle={{ position: 'absolute', top: 20, right: 70, zIndex: 100 }}
                nextPrevSong={currentSong.id + 1}
                currentSong={currentSong}
                songs={songs}
                onPressHandler={(song: any) => {
                    return songsListRef.current.handlePressItem(song);
                }}
            />
            <SongInfoTitle songTitle={currentSong.videoDetails.title} />
            <PlayerControl
                iconStyle={{
                    borderWidth: 1,
                    borderColor: '#eee',
                    borderRadius: 15,
                    padding: 5,
                    backgroundColor: '#fff'
                }}
                iconType='entypo'
                iconSize={18}
                action='full-screen'
                iconName='resize-full-screen'
                containerStyle={{ position: 'absolute', top: 70, right: 120, zIndex: 100 }}
                currentSong={currentSong}
                songs={songs}
                onPressHandler={() => {
                    basePlayer.current.presentFullscreenPlayer();
                }}
            />
            <PlayerControlTimeSeek
                ref={seekRef}
                basePlayer={basePlayer}
                currentSong={currentSong}
            />
        </SongInfoContainer>
    );
};

const areEqual = (prevProps: any, nextProps: any) => {
    if (nextProps.isSearching && !nextProps.isComingFromSearchingSong) {
        return true;
    }
    return false;
};

export default memo(Player, areEqual);
