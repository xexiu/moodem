import PropTypes from 'prop-types';
import React, { memo, useCallback } from 'react';
import MediaListEmpty from '../../../screens/User/functional-components/MediaListEmpty';
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
    optionalCallback?: Function
};

const MemoizedItems = ({ data, handleOnClickItem, buttonActions, optionalCallback }: PropsItems) => {
    const renderItem = useCallback(({ item, index }: PropsItem) => (
        <MemoizedItem
            index={index}
            item={item}
            isPlaying={item.isPlaying}
            isVotingSong={item.isVotingSong}
            handleOnClickItem={handleOnClickItem}
            buttonActions={buttonActions}
            optionalCallback={optionalCallback}
        />
    ), []);

    const keyExtractor = useCallback((item: any) => item.id.toString(), []);

    return (
        <CommonFlatList
            emptyListComponent={<MediaListEmpty />}
            data={data}
            action={renderItem}
            keyExtractor={keyExtractor}
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
