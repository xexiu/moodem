import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import BgImage from '../../common/functional-components/BgImage';
import CommonFlatListItem from '../../common/functional-components/CommonFlatListItem';
import PreLoader from '../../common/functional-components/PreLoader';
import { MediaButtons } from './MediaButtons';

const Song = (props: any) => {
    const {
        song,
        media,
        isSearching,
        group,
        player,
        sendMediaToServer,
        handlePressSong
    } = props;
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log('SONGGGGGG 2222');
        if (isFocused) {
            setIsLoading(false);
        }

        return () => { };
    }, [isFocused]);

    function cleanImageParams(img: string) {
        if (img.indexOf('hqdefault.jpg') >= 0) {
            return img.replace(/(\?.*)/g, '');
        }
        return img;
    }

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
            title={song.videoDetails.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={song.videoDetails.author.name.replace('VEVO', '')}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
            leftAvatar={{
                source: { uri: song.isPlaying ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt6gzJoRwfiO7YqqZvyjXI9p_wuLtSMIBGUA&usqp=CAU' : cleanImageParams(song.videoDetails.thumbnails[1].url) }
            }}
            buttonGroup={
                isSearching ? [] :
                    MediaButtons(song, media, group, ['votes', 'remove'])
            }
            chevron={!song.isMediaOnList && {
                name: 'arrow-right',
                type: 'AntDesign',
                color: '#dd0031',
                onPress: () => sendMediaToServer(song),
                size: 10,
                raised: true,
                iconStyle: { fontSize: 27, alignSelf: 'center' }
            }}
            action={() => {
                player.current.dispatchActionsPressedTrack(song,
                    () => {
                        handlePressSong(song);
                    });
            }}
        />
    );
};

const hasUserVoted = (prevProps: any, nextProps: any) => {
    const { voted_users } = prevProps.song;

    const prevCountVotes = voted_users.length;
    const nextCountVotes = voted_users.length;
    const currentUserIsVoting = voted_users.includes(nextProps.user.uid);

    return prevCountVotes !== nextCountVotes || currentUserIsVoting;
};

const areEqual = (prevProps: any, nextProps: any) => {
    const {
        currentSong,
        isPrevSong
    } = prevProps.song;

    if ((currentSong || isPrevSong)) {
        isPrevSong && delete prevProps.song.isPrevSong;
        return false;
    } else if (hasUserVoted(prevProps, nextProps)) {
        return false;
    }
    return true;
};

export default memo(Song, areEqual);
