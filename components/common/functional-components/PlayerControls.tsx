import React, { useRef } from 'react';
import BasePlayer from './BasePlayer';
import PlayerControl from './PlayerControl';
import PlayerControlFullScreen from './PlayerControlFullScreen';
import PlayerControlPlayPause from './PlayerControlPlayPause';
import PlayerControlRepeat from './PlayerControlRepeat';
import { PlayerControlsContainer } from './PlayerControlsContainer';
import PlayerControlTimeSeek from './PlayerControlTimeSeek';
import { SongInfoContainer } from './SongInfoContainer';
import SongInfoTitle from './SongInfoTitle';

const PlayerControls = (props: any) => {
    const {
        chatRoom,
        items,
        isPlaying,
        item,
        handleOnClickItem,
        indexItem
    } = props;

    const repeatRef = useRef() as any;
    const playPauseRef = useRef() as any;
    const basePlayer = useRef() as any;
    const seekRef = useRef() as any;

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
                    chatRoom={chatRoom}
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
                <PlayerControlFullScreen basePlayer={basePlayer} />
            </PlayerControlsContainer>
            <SongInfoTitle songTitle={item.title} />
            <PlayerControlTimeSeek
                ref={seekRef}
                basePlayer={basePlayer}
                item={item}
            />
        </SongInfoContainer>
    );
};

export default PlayerControls;
