import React, { memo } from 'react';
import MemoizedItems from './MemoizedItems';

const MemoizedSongsList = (props: any) => {
    const {
        data,
        buttonActions,
        handleOnClickItem = Function,
        optionalCallback,
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
            optionalCallback={optionalCallback}
            chevron={chevron}
            checkSizeChangeHandler={checkSizeChangeHandler}
        />
    );
};

export default memo(MemoizedSongsList);
