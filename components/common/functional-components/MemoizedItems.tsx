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
    data: string[],
    onClick: Function,
    sendMediaToServer?: Function,
    media?: Function,
    isSearching?: boolean
};

const MemoizedItems = ({ data, onClick, sendMediaToServer, media, isSearching }: PropsItems) => {
    console.log('rendering items', data);
    const renderItem = ({ item, index }: PropsItem) => (
        <MemoizedItem
            index={index}
            item={item}
            isPlaying={item.isPlaying}
            onClick={onClick}
            sendMediaToServer={sendMediaToServer}
            media={media}
            isSearching={isSearching}
        />
    );
    return (
        <CommonFlatList
            emptyListComponent={<MediaListEmpty />}
            data={data}
            action={renderItem}
            extraData={data}
            keyExtractor={(item) => item.id.toString()}
        />
    );
};

MemoizedItems.propTypes = {
    data: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
};

MemoizedItems.defaultProps = {
    data: []
};

export default memo(MemoizedItems);
