import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { Song } from './Song';

const SongsList = (props: any) => {
    const {
        media,
        handler,
        group,
        items,
        isSearching,
        player
    } = props;
    const flatListRef = useRef(null);
    const [isLoading, setIsloading] = useState(true);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({} as any), []);

    useEffect(() => {
        console.log('4. SongsList');
        setIsloading(false);
    }, [forceUpdate]);

    const renderItem = (song: any) => {
        return (<Song
            isSearching={isSearching}
            song={song}
            media={media}
            group={group}
            handler={handler}
            player={player}
            pressItemHandler={(_song: any, isSongPlaying: boolean) => {
                items.forEach((_item: any) => {
                    _item.isPlaying = false;
                });
                song.isPlaying = isSongPlaying;
                forceUpdate();
            }}
        />);
    };

    const keyExtractor = useCallback((item: any) => item.index.toString(), [items]);

    function renderList() {
        return (
            <CommonFlatList
                onContentSizeChange={() => {
                    console.log('SIZE CHANGED');
                }}
                reference={flatListRef}
                data={items}
                keyExtractor={keyExtractor}
                action={({ item }) => renderItem(item)}
            />
        );
    }

    if (isLoading) {
        return (
            <PreLoader
                containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                size={50}
            />
        );
    }

    return renderList();
};

memo(SongsList);

export { SongsList };
