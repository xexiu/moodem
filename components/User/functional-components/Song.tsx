import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import { BgImage } from '../../common/functional-components/BgImage';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { MediaButtons } from './MediaButtons';

const Song = (props: any) => {
    const {
        song,
        media,
        isSearching,
        group,
        handlePressSong
    } = props;
    const [isLoading, setIsloading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            setIsloading(false);
        }
    }, []);

    const isPlayerPlaying = () => !media.playerRef.current.state.paused;

    const setSource = () => {
        if (isPlayerPlaying() && song.isPlaying) {
            return {
                source: {
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt6gzJoRwfiO7YqqZvyjXI9p_wuLtSMIBGUA&usqp=CAU'
                }
            };
        }
        return {
            source: { uri: song.artwork_url }
        };
    };

    const sendMediaToServer = () => {
        Object.assign(song, {
            isMediaOnList: true
        });

        media.emit('send-message-media', { song, chatRoom: group.group_name });
    };

    if (isLoading) {
        return (
            <View>
                <BgImage />
                <PreLoader
                    containerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    size={50}
                />
            </View>
        );
    }

    return (
        <CommonFlatListItem
            bottomDivider
            title={song.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={song.user && song.user.username}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            leftAvatar={setSource()}
            buttonGroup={
                isSearching ? [] :
                    MediaButtons(song, media, group, ['votes', 'remove'])
            }
            chevron={!song.isMediaOnList && {
                name: 'arrow-right',
                type: 'AntDesign',
                color: '#dd0031',
                onPress: () => sendMediaToServer(),
                size: 10,
                raised: true,
                iconStyle: { fontSize: 27, alignSelf: 'center' }
            }}
            action={() => {
                media.playerRef.current.dispatchActionsPressedTrack(song);
                const isCurrentSongPlaying = new Promise(resolve => {
                    setTimeout(() => {
                        resolve(!media.playerRef.current.state.paused);
                    }, 50);
                });
                isCurrentSongPlaying
                    .then(playing => {
                        return handlePressSong(song, playing);
                    });
            }}
        />
    );
};

const areEqual = (nextProps: any, prevProps: any) => {
    if (nextProps.song.currentSong || nextProps.song.isPrevSong) {
        nextProps.song.isPrevSong && delete nextProps.song.isPrevSong;
        return false;
    } else if (!prevProps.isSearching) {
        return false;
    }
    return true;
};

export default memo(Song, areEqual);
