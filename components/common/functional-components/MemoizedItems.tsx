import React, { memo, useCallback } from 'react';
import { MediaListEmpty } from '../../User/functional-components/MediaListEmpty';
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
    chevron?: string,
    reference?: any,
    checkSizeChangeHandler?: Function,
    chatRoom?: string
};

// tslint:disable-next-line:max-line-length
const MemoizedItems = ({ chatRoom, reference, data, handleOnClickItem, buttonActions, chevron, checkSizeChangeHandler }: PropsItems) => {
    const renderItem = useCallback(({ item, index }: PropsItem) => (
        <MemoizedItem
            chatRoom={chatRoom}
            index={index}
            votedUsers={item.voted_users ? item.voted_users.length : 0}
            item={item}
            handleOnClickItem={handleOnClickItem}
            buttonActions={buttonActions}
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

export default memo(MemoizedItems);
