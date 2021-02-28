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

    useEffect(() => {
        console.log('4. SongsList');
        setIsloading(false);
    }, []);

    const renderItem = useCallback(({ item, index }) => <Song
        isSearching={isSearching}
        song={item}
        media={media}
        group={group}
        handler={handler}
        player={player}
    />, [items]);
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
                action={renderItem}
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
