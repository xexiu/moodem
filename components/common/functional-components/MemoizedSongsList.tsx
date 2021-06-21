import React, { memo } from 'react';
import MemoizedItems from './MemoizedItems';

const MemoizedSongsList = (props: any) => {
    const {
        data,
        buttonActions,
        handleOnClickItem = Function,
        chevron,
        reference,
        checkSizeChangeHandler
    } = props;

    return (
        <MemoizedItems
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
