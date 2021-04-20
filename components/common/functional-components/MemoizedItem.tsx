import React, { memo } from 'react';
import { MediaButtons } from '../../../components/User/functional-components/MediaButtons';
import CommonFlatListItem from './CommonFlatListItem';

const MemoizedItem = ({ index, item, handleOnClickItem, media, buttonActions, optionalCallback }: any) => {
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
            buttonGroup={MediaButtons(item, media, buttonActions, optionalCallback)}
            action={() => handleOnClickItem(index)}
        />
    );
};

function areEqual(prevProps: any, nextProps: any) {
    const { isPlaying, votedSong, removedSong } = nextProps;
    const { isPlaying: prevIsPlaying, removedSong: prevSongRemoved } = prevProps;

    const isPlayingEqual = isPlaying === prevIsPlaying;

    if (removedSong) {
        if (nextProps.index === removedSong.id) {
            return false;
        } else if (nextProps.index > removedSong.id) {
            return false;
        }
    }

    if (votedSong && !removedSong) {
        return false;
    }

    return nextProps.index === prevProps.index && isPlayingEqual;
}

export default memo(MemoizedItem, areEqual);
