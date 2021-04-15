import React, { memo, useContext } from 'react';
import { View } from 'react-native';
import { SongsContext } from '../../User/store-context/SongsContext';
import MemoizedItems from './MemoizedItems';
import Player from './Player';

const MemoizedPlayerSongsList = (props: any) => {
    const {
        data,
        media,
        buttonActions,
        isRemovingSong,
        isAddingSong,
        isVoting
    } = props;

    const { dispatch, indexItem } = useContext(SongsContext) as any;

    const handleOnClickItem = (index: number) => {
        dispatch({
            type: 'update_song_click_play_pause',
            value: {
                indexItem: index,
                index
            }
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <Player
                isPlaying={data[indexItem].isPlaying}
                item={data[indexItem]}
                handleOnClickItem={handleOnClickItem}
                items={data}
                isRemovingSong={isRemovingSong}
            />
            <MemoizedItems
                data={data}
                handleOnClickItem={handleOnClickItem}
                media={media}
                buttonActions={buttonActions}
                isRemovingSong={isRemovingSong}
                isAddingSong={isAddingSong}
            />
        </View>
    );
};

export default memo(MemoizedPlayerSongsList);
