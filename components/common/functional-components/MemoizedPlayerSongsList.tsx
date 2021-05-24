import React, { memo, useCallback, useContext } from 'react';
import { View } from 'react-native';
import { SongsContext } from '../../User/store-context/SongsContext';
import MemoizedItems from './MemoizedItems';
import Player from './Player';

const MemoizedPlayerSongsList = (props: any) => {
    const {
        data,
        buttonActions
    } = props;

    const {
        dispatchContextSongs,
        indexItem
    } = useContext(SongsContext) as any;

    const handleOnClickItem = useCallback((index: number) => dispatchContextSongs({
        type: 'update_song_click_play_pause',
        value: {
            indexItem: index,
            index,
            removedSong: null,
            votedSong: null,
            addedSong: null,
            transformedSong: null
        }
    }), []);

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
                buttonActions={buttonActions}
            />
        </View>
    );
};

export default memo(MemoizedPlayerSongsList);
