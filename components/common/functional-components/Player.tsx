import React, { useRef } from 'react';
import { Icon } from 'react-native-elements';
import BasePlayer from './BasePlayer';
import PlayerControl from './PlayerControl';
import PlayerControlPlayPause from './PlayerControlPlayPause';
import PlayerControlRepeat from './PlayerControlRepeat';
import PlayerControlTimeSeek from './PlayerControlTimeSeek';
import { SongInfoContainer } from './SongInfoContainer';
import SongInfoTitle from './SongInfoTitle';

const Player = (props: any) => {
    const {
        items,
        isPlaying,
        item,
        handleOnClickItem
    } = props;

    const repeatRef = useRef(null);
    const playPauseRef = useRef(null);
    const basePlayer = useRef(null);
    const seekRef = useRef(null);

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
                containerStyle={{ position: 'absolute', top: 20, left: 100, zIndex: 100 }}
                nextPrevSong={item.id - 1}
                item={item}
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
                containerStyle={{ position: 'absolute', top: 70, left: 140, zIndex: 100 }}
            />
            <PlayerControlPlayPause
                ref={playPauseRef}
                isPlaying={isPlaying}
                item={item}
                handleOnClickItem={handleOnClickItem}
            />
            <BasePlayer
                repeatRef={repeatRef}
                basePlayer={basePlayer}
                seekRef={seekRef}
                playPauseRef={playPauseRef}
                item={item}
                handleOnClickItem={handleOnClickItem}
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
                containerStyle={{ position: 'absolute', top: 20, right: 100, zIndex: 100 }}
                nextPrevSong={item.id + 1}
                item={item}
                items={items}
                handleOnClickItem={handleOnClickItem}
            />
            <SongInfoTitle songTitle={item.videoDetails.title} />
            <Icon
                containerStyle={{ position: 'absolute', top: 70, right: 140, zIndex: 100 }}
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

export default Player;
