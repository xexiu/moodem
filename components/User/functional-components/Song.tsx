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
        handlePressSong,
        player,
        sendMediaToServer
    } = props;
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            setIsLoading(false);
        }

        return () => { };
    }, [isFocused]);

    const isPlayerPlaying = () => !player.current.state.paused;

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
                onPress: () => sendMediaToServer(song),
                size: 10,
                raised: true,
                iconStyle: { fontSize: 27, alignSelf: 'center' }
            }}
            action={() => {
                return player.current.dispatchActionsPressedTrack(
                    song,
                    () => handlePressSong(song)
                );
            }}
        />
    );
};

const hasUserVoted = (prevProps: any, nextProps: any) => {
    const prevCountVotes = prevProps.song.voted_users.length;
    const nextCountVotes = nextProps.song.voted_users.length;
    const currentUserIsVoting = nextProps.song.voted_users.includes(nextProps.user.uid);

    return prevCountVotes !== nextCountVotes || currentUserIsVoting;
};

const areEqual = (prevProps: any, nextProps: any) => {
    if ((prevProps.song.currentSong || prevProps.song.isPrevSong)) {
        prevProps.song.isPrevSong && delete prevProps.song.isPrevSong;
        return false;
    } else if (hasUserVoted(prevProps, nextProps)) {
        return false;
    }
    return true;
};

export default memo(Song, areEqual);
