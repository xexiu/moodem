import React, { memo } from 'react';
import { MediaButtons } from '../../../components/User/functional-components/MediaButtons';
import CommonFlatListItem from './CommonFlatListItem';

const MemoizedItem = ({ index, item, handleOnClickItem, media, buttonActions }: any) => {
    console.log(`rendering item, selected=${String(item.isPlaying)} ${String(index)}`);

    return (
        <CommonFlatListItem
            bottomDivider
            topDivider={true}
            title={item.videoDetails.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 2 }}
            subTitleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={`${item.videoDetails.author.name.replace('VEVO', '')} ${String(item.isPlaying)} ${String(index)}`}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            leftAvatar={{
                source: {
                    uri: item.isPlaying ?
                        'https://thumbs.gfycat.com/DifficultAjarJanenschia-small.gif' :
                        item.videoDetails.thumbnails[0].url
                }
            }}
            buttonGroup={MediaButtons(item, media, buttonActions)}
            action={() => handleOnClickItem(index)}
        />
    );
};

function areEqual(prevItem: any, nextItem: any) {
    if (nextItem.isRemovingSong !== prevItem.isRemovingSong) {
        return false;
    }
    if (nextItem.isAddingSong !== prevItem.isAddingSong) {
        return false;
    }
    return (prevItem.index === nextItem.index && prevItem.isPlaying === nextItem.isPlaying);
}

export default memo(MemoizedItem);
