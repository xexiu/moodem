import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import BgImage from '../../common/functional-components/BgImage';
import CommonFlatListItem from '../../common/functional-components/CommonFlatListItem';
import PreLoader from '../../common/functional-components/PreLoader';
import { PlayerControlPlayPause } from '../../common/PlayerControlPlayPause';
import { PlayerControlsContainer } from '../../common/PlayerControlsContainer';
import { MediaButtons } from './MediaButtons';

const Song = (props: any) => {
    const {
        song,
        user,
        media,
        isSearching,
        group,
        player,
        sendMediaToServer,
        handlePressSong
    } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [currentSong, setCurrentSong] = useState({}) as any;
    const [prevSong, setPrevSong] = useState({}) as any;
    const [songIsPlaying, setSongIsPlaying] = useState(false);
    const [playingSongs, setPlayingSongs] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log('SONGGGGGG 2222', user);
        if (isFocused) {
            setIsLoading(false);
        }

        return () => { };
    }, [isFocused, songIsPlaying]);

    return (
            <CommonFlatListItem
                bottomDivider
                title={song.videoDetails.title}
                titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                subtitle={song.videoDetails.author.name.replace('VEVO', '')}
                subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
                // leftAvatar={{
                //     source: { uri: song.isPlaying ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt6gzJoRwfiO7YqqZvyjXI9p_wuLtSMIBGUA&usqp=CAU' : cleanImageParams(song.videoDetails.thumbnails[1].url) }
                // }}
                // buttonGroup={
                //     isSearching ? [] :
                //         MediaButtons(song, media, group, ['votes', 'remove'])
                // }
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
                    // setSongIsPlaying(songIsPlaying);
                    player.current.dispatchActionsPressedTrack(song,
                        (_song: any) => {
                            console.log('Neww song', _song.index, 'and currentSongPlaying', _song.isCurrentSongPlaying);

                            if (_song.isCurrentSongPlaying) {
                                setPlayingSongs([_song]);
                                handlePressSong(song);
                                setSongIsPlaying(_song.isPlaying);
                            } else if (!_song.isCurrentSongPlaying) {
                                setPlayingSongs([_song]);
                                handlePressSong(song);
                                setSongIsPlaying(_song.isPlaying);
                            }
                        });
                }}
            />
    );
};

const hasUserVoted = (nextProps: any) => {
    return nextProps.song.voted_users.includes(nextProps.user.uid);
};

const areEqual = (prevProps: any, nextProps: any) => {
    console.log('PREVV', prevProps, 'NExtt', nextProps);
    const {
        currentSong,
        isPrevSong
    } = prevProps.song;

    if ((currentSong || isPrevSong)) {
        isPrevSong && delete prevProps.song.isPrevSong;
        return false;
    } else if (hasUserVoted(nextProps)) {
        return false;
    }
    return true;
};

export default memo(Song, areEqual);
