import React, { memo } from 'react';
import { MediaButtons } from '../../../components/User/functional-components/MediaButtons';
import CommonFlatListItem from './CommonFlatListItem';

const MemoizedItem = ({ index, item, handleOnClickItem, buttonActions, optionalCallback }: any) => {
    console.log('Render Item');

    return (
        <CommonFlatListItem
            bottomDivider
            topDivider={true}
            title={item.details.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 2 }}
            titleStyle={{ paddingRight: 5, paddingBottom: 7}}
            subTitleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={`${item.details.author.name.replace('VEVO', '')}`}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            leftAvatar={{
                source: {
                    uri: item.details.thumbnails[0].url
                }
            }}
            buttonGroup={MediaButtons(item, buttonActions, optionalCallback)}
            action={() => handleOnClickItem(index)}
        />
    );
};

export default memo(MemoizedItem);
