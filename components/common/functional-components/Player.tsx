import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import PlayerControlPlayPause from './PlayerControlPlayPause';
import PlayerControlRepeat from './PlayerControlRepeat';
import PlayerControlTimeSeek from './PlayerControlTimeSeek';
import { SongInfoContainer } from './SongInfoContainer';
import SongInfoTitle from './SongInfoTitle';
import BasePlayer from './BasePlayer';
import PlayerControl from './PlayerControl';

const Player = (props: any) => {
    const {
        repeatRef,
        playPauseRef,
        basePlayer,
        seekRef,
        items,
        isPlaying,
        item,
        onClick
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
                nextPrevSong={item.id - 1}
                item={item}
                items={items}
                onClick={onClick}
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
                isPlaying={isPlaying}
                item={item}
                onClick={onClick}
            />
            <BasePlayer
                repeatRef={repeatRef}
                basePlayer={basePlayer}
                seekRef={seekRef}
                playPauseRef={playPauseRef}
                item={item}
                onClick={onClick}
                items={items}
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
                nextPrevSong={item.id + 1}
                item={item}
                items={items}
                onClick={onClick}
            />
            <SongInfoTitle songTitle={item.videoDetails.title} />
            <Icon
                containerStyle={{ position: 'absolute', top: 70, right: 120, zIndex: 100 }}
                raised={false}
                reverse={false}
                iconStyle={{
                    borderWidth: 1,
                    borderColor: '#eee',
                    borderRadius: 15,
                    padding: 5,
                    backgroundColor: '#fff'
                }}
                name='resize-full-screen'
                type='entypo'
                color='#dd0031'
                size={18}
                onPress={() => basePlayer.current.presentFullscreenPlayer()}
            />
            <PlayerControlTimeSeek
                ref={seekRef}
                basePlayer={basePlayer}
                item={item}
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
