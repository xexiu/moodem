import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { MediaListEmpty } from '../../../screens/User/functional-components/MediaListEmpty';
import CommonFlatList from './CommonFlatList';
import MemoizedItem from './MemoizedItem';

type PropsItem = {
    item: any,
    index: number
};
type PropsItems = {
    data: (any | any)[],
    handleOnClickItem: Function,
    media?: any,
    buttonActions: string[],
    removedSong?: any,
    votedSong?: any,
    optionalCallback?: Function
};

// tslint:disable-next-line:max-line-length
const MemoizedItems = ({ data, handleOnClickItem, media, buttonActions, optionalCallback, removedSong, votedSong }: PropsItems) => {
    const renderItem = ({ item, index }: PropsItem) => (
        <MemoizedItem
            index={index}
            item={item}
            isPlaying={item.isPlaying}
            handleOnClickItem={handleOnClickItem}
            media={media}
            buttonActions={buttonActions}
            removedSong={removedSong}
            votedSong={votedSong}
            optionalCallback={optionalCallback}
        />
    );
    return (
        <CommonFlatList
            emptyListComponent={<MediaListEmpty />}
            data={data}
            action={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    );
};

MemoizedItems.propTypes = {
    data: PropTypes.array.isRequired,
    handleOnClickItem: PropTypes.func.isRequired
};

MemoizedItems.defaultProps = {
    data: []
};

export default memo(MemoizedItems);
