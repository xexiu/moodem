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
    buttonActions?: string[],
    optionalCallback?: Function,
    chevron?: string,
    reference?: any,
    checkSizeChangeHandler?: Function
};

// tslint:disable-next-line:max-line-length
const MemoizedItems = ({ reference, data, handleOnClickItem, buttonActions, optionalCallback, chevron, checkSizeChangeHandler }: PropsItems) => {
    const renderItem = useCallback(({ item, index }: PropsItem) => (
        <MemoizedItem
            index={index}
            votedUsers={item.voted_users ? item.voted_users.length : 0}
            item={item}
            handleOnClickItem={handleOnClickItem}
            buttonActions={buttonActions}
            optionalCallback={optionalCallback}
            chevron={chevron}
        />
    ), []);

    const keyExtractor = useCallback((item: any) => item.id, []);

    return (
        <CommonFlatList
            reference={reference}
            emptyListComponent={<MediaListEmpty />}
            data={data}
            action={renderItem}
            keyExtractor={keyExtractor}
            onContentSizeChange={checkSizeChangeHandler}
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
