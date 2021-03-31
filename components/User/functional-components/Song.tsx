import React, { memo } from 'react';
import CommonFlatListItem from '../../common/functional-components/CommonFlatListItem';
import { MediaButtons } from './MediaButtons';

const Song = (props: any) => {
    const {
        currentSong,
        isPlaying,
        navigation,
        resetLoadingSongs,
        song,
        media,
        isSearching = false,
        handlePress,
        group,
        sendSong
    } = props;

    const sendMediaToServer = async (cb: Function) => {
        Object.assign(song, {
            isMediaOnList: true,
            isPlaying: false
        });

        await media.emit('emit-medias-group', { song, chatRoom: group.group_name, isComingFromSearchingSong: true });
        navigation.navigate(group.group_name);
    };

    const handlePressSong = () => {
        if (resetLoadingSongs) {
            resetLoadingSongs(true);
        }
        handlePress(song);
    };

    return (
        <CommonFlatListItem
            bottomDivider
            title={song.videoDetails.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 2 }}
            subTitleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={song.videoDetails.author.name.replace('VEVO', '')}
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
                    return sendMediaToServer(sendSong);
                },
                size: 10,
                raised: true,
                iconStyle: { fontSize: 27, alignSelf: 'center' }
            }}
            action={handlePressSong}
        />
    );
};

export default memo(Song);
