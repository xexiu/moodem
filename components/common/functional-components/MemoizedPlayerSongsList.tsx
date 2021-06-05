import React, { memo, useCallback, useContext } from 'react';
import { View } from 'react-native';
import { SongsContext } from '../../User/store-context/SongsContext';
import MemoizedItems from './MemoizedItems';
import Player from './Player';

const MemoizedPlayerSongsList = (props: any) => {
    const {
        data,
        buttonActions,
        handleOnClickItem = useCallback((index: number) => dispatchContextSongs({
            type: 'update_song_click_play_pause',
            value: {
                indexItem: index,
                index,
                removedSong: null,
                votedSong: null,
                addedSong: null,
                transformedSong: null
            }
        }), []),
        optionalCallback,
        indexItem
    } = props;

    const {
        dispatchContextSongs
    } = useContext(SongsContext) as any;

    return (
        <View style={{ flex: 1 }}>
            <Player
                isPlaying={data[indexItem].isPlaying}
                item={data[indexItem]}
                handleOnClickItem={handleOnClickItem}
                items={data}
                indexItem={indexItem}
            />
            <MemoizedItems
                data={data}
                handleOnClickItem={handleOnClickItem}
                buttonActions={buttonActions}
                optionalCallback={optionalCallback}
            />
        </View>
    );
};

export default memo(MemoizedPlayerSongsList);
