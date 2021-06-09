import React, { memo } from 'react';
import MemoizedItems from './MemoizedItems';

const MemoizedSongsList = (props: any) => {
    const {
        data,
        buttonActions,
        handleOnClickItem = Function,
        optionalCallback
    } = props;

    return (
        <MemoizedItems
            data={data}
            handleOnClickItem={handleOnClickItem}
            buttonActions={buttonActions}
            optionalCallback={optionalCallback}
        />
    );
};

export default memo(MemoizedSongsList);
