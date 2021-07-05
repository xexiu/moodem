import React, { memo } from 'react';
import MemoizedItems from './MemoizedItems';

const MemoizedSongsList = (props: any) => {
    const {
        chatRoom,
        data,
        buttonActions,
        handleOnClickItem = Function,
        chevron,
        reference,
        checkSizeChangeHandler
    } = props;

    return (
        <MemoizedItems
            chatRoom={chatRoom}
            reference={reference}
            data={data}
            handleOnClickItem={handleOnClickItem}
            buttonActions={buttonActions}
            chevron={chevron}
            checkSizeChangeHandler={checkSizeChangeHandler}
        />
    );
};

export default memo(MemoizedSongsList);
