import React, { memo } from 'react';
import CommonFlatListItem from '../../common/functional-components/CommonFlatListItem';
import { MediaButtons } from './MediaButtons';

const Song = (props: any) => {
    const {
        isPlaying,
        navigation,
        song,
        media,
        isSearching = false,
        handlePress,
        group
    } = props;

    const sendMediaToServer = async () => {
        Object.assign(song, {
            isMediaOnList: true,
            isPlaying: false
        });

        await media.emit('emit-medias-group', { song, chatRoom: group.group_name, isComingFromSearchingSong: true });
        navigation.navigate(group.group_name);
    };

    return (
        <CommonFlatListItem
            bottomDivider
            title={song.videoDetails.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 2 }}
            subTitleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={`${song.videoDetails.author.name.replace('VEVO', '')}`}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            leftAvatar={{
                source: {
                    uri: isPlaying ?
                        'https://thumbs.gfycat.com/DifficultAjarJanenschia-small.gif' :
                        song.videoDetails.thumbnails[0].url
                }
            }}
            buttonGroup={
                isSearching ? [] :
                    MediaButtons(song, media, ['votes', 'remove'])
            }
            chevron={!song.isMediaOnList && {
                name: 'arrow-right',
                type: 'AntDesign',
                color: '#dd0031',
                onPress: () => {
                    return sendMediaToServer();
                },
                size: 10,
                raised: true,
                iconStyle: { fontSize: 27, alignSelf: 'center' }
            }}
            action={() => {
                handlePress();
            }}
        />
    );
};

export default memo(Song);
