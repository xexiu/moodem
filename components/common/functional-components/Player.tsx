import React, { useRef } from 'react';
import { Icon } from 'react-native-elements';
import BasePlayer from './BasePlayer';
import PlayerControl from './PlayerControl';
import PlayerControlPlayPause from './PlayerControlPlayPause';
import PlayerControlRepeat from './PlayerControlRepeat';
import { PlayerControlsContainer } from './PlayerControlsContainer';
import PlayerControlTimeSeek from './PlayerControlTimeSeek';
import { SongInfoContainer } from './SongInfoContainer';
import SongInfoTitle from './SongInfoTitle';

const Player = (props: any) => {
    const {
        items,
        isPlaying,
        item,
        handleOnClickItem,
        indexItem
    } = props;

    const repeatRef = useRef(null);
    const playPauseRef = useRef(null);
    const basePlayer = useRef(null);
    const seekRef = useRef(null);

    return (
        <SongInfoContainer>
            <PlayerControlsContainer>
                <PlayerControl
                    iconStyle={{
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#eee',
                        padding: 10,
                        borderRadius: 20,
                        width: 40,
                        position: 'relative'
                    }}
                    iconType='font-awesome'
                    iconSize={18}
                    action='prev'
                    iconName='step-backward'
                    containerStyle={{ position: 'absolute', top: 20, left: 0, zIndex: 100 }}
                    nextPrevSong={indexItem - 1}
                    items={items}
                    handleOnClickItem={handleOnClickItem}
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
                    containerStyle={{ position: 'absolute', top: 70, left: 50, zIndex: 100 }}
                />
                <PlayerControlPlayPause
                    ref={playPauseRef}
                    isPlaying={isPlaying}
                    handleOnClickItem={handleOnClickItem}
                    indexItem={indexItem}
                />
                <BasePlayer
                    repeatRef={repeatRef}
                    basePlayer={basePlayer}
                    seekRef={seekRef}
                    playPauseRef={playPauseRef}
                    item={item}
                    handleOnClickItem={handleOnClickItem}
                    items={items}
                    indexItem={indexItem}
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
                    containerStyle={{ position: 'absolute', top: 20, right: 0, zIndex: 100 }}
                    nextPrevSong={indexItem + 1}
                    items={items}
                    handleOnClickItem={handleOnClickItem}
                />
                <Icon
                    containerStyle={{ position: 'absolute', top: 70, right: 50, zIndex: 100 }}
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
            </PlayerControlsContainer>
            <SongInfoTitle songTitle={item.details.title} />
            <PlayerControlTimeSeek
                ref={seekRef}
                basePlayer={basePlayer}
                item={item}
            />
        </SongInfoContainer>
    );
};

export default Player;
