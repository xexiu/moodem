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
    isRemovingSong?: boolean,
    isAddingSong?: boolean
};

const MemoizedItems = ({ data, handleOnClickItem, media, buttonActions, isRemovingSong, isAddingSong }: PropsItems) => {
    console.log('Render flatList songs');
    const renderItem = ({ item, index }: PropsItem) => (
        <MemoizedItem
            index={index}
            item={item}
            isPlaying={item.isPlaying}
            handleOnClickItem={handleOnClickItem}
            media={media}
            data={data}
            buttonActions={buttonActions}
            isRemovingSong={isRemovingSong}
            isAddingSong={isAddingSong}
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
