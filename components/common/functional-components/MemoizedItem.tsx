import React, { memo } from 'react';
import { MediaButtons } from '../../../components/User/functional-components/MediaButtons';
import CommonFlatListItem from './CommonFlatListItem';

const MemoizedItem = ({ index, item, isPlaying, onClick, sendMediaToServer, media, isSearching }: any) => {
    console.log(`rendering item, selected=${isPlaying}`);

    return (
        <CommonFlatListItem
            bottomDivider
            topDivider={true}
            title={item.videoDetails.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 2 }}
            subTitleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={`${item.videoDetails.author.name.replace('VEVO', '')}`}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            leftAvatar={{
                source: {
                    uri: item.isPlaying ?
                        'https://thumbs.gfycat.com/DifficultAjarJanenschia-small.gif' :
                        item.videoDetails.thumbnails[0].url
                }
            }}
            buttonGroup={
                isSearching ? [] :
                    MediaButtons(item, media, ['votes', 'remove'])
            }
            chevron={!item.isMediaOnList && {
                name: 'arrow-right',
                type: 'AntDesign',
                color: '#dd0031',
                onPress: () => {
                    return sendMediaToServer(item);
                },
                size: 10,
                raised: true,
                iconStyle: { fontSize: 27, alignSelf: 'center' }
            }}
            action={() => onClick(index)}
        />
    );
};

function areEqual(prevItem: any, nextItem: any) {
    return prevItem.id === nextItem.id && prevItem.isPlaying === nextItem.isPlaying;
}

export default memo(MemoizedItem, areEqual);
