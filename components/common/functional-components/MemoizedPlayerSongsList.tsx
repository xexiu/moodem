import React, { memo, useCallback, useContext } from 'react';
import { View } from 'react-native';
import { SongsContext } from '../../User/store-context/SongsContext';
import MemoizedItems from './MemoizedItems';
import Player from './Player';

const MemoizedPlayerSongsList = (props: any) => {
    const {
        data,
        media,
        buttonActions
    } = props;

    const {
        dispatch,
        indexItem,
        removedSong,
        votedSong
    } = useContext(SongsContext) as any;

    const handleOnClickItem = useCallback((index: number) => {
        dispatch({
            type: 'update_song_click_play_pause',
            value: {
                indexItem: index,
                index,
                removedSong: null,
                votedSong: null,
                addedSong: null
            }
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Player
                isPlaying={data[indexItem].isPlaying}
                item={data[indexItem]}
                handleOnClickItem={handleOnClickItem}
                items={data}
            />
            <MemoizedItems
                data={data}
                handleOnClickItem={handleOnClickItem}
                media={media}
                buttonActions={buttonActions}
                removedSong={removedSong}
                votedSong={votedSong}
            />
        </View>
    );
};

export default memo(MemoizedPlayerSongsList);
