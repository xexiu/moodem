import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
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
        sendMediaToServer
    } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [currentSong, setCurrentSong] = useState({}) as any;
    const [prevSong, setPrevSong] = useState({}) as any;
    const [songIsPlaying, setSongIsPlaying] = useState(false);
    const [playingSongs, setPlayingSongs] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log('SONGGGGGG 2222');
        if (isFocused) {
            setIsLoading(false);
        }

        return () => { };
    }, [isFocused, songIsPlaying]);

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

    const handlePressSong = () => {
        setPlayingSongs(prevSongs => {
            const isCurrentSong = !prevSongs.includes(song);

            if (prevSongs.length) {
                prevSongs.forEach(_song => {
                    _song.currentSong && delete _song.currentSong;
                    _song.isPrevSong && delete _song.isPrevSong;

                    Object.assign(_song, {
                        isPrevSong: true,
                        isPlaying: false
                    });
                });
            }

            if (!isCurrentSong) {
                Object.assign(song, {
                    isPlaying: !player.current.state.paused,
                    currentSong: true
                });
            }
            return [...playingSongs, song];
        });
    };

    console.log('SONG', song, 'currentSong', currentSong, 'PrevSong', prevSong);
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
                // setSongIsPlaying(songIsPlaying);
                player.current.dispatchActionsPressedTrack(song,
                    (_song: any) => {
                        console.log('Neww song', _song.index, 'and currentSongPlaying', _song.isCurrentSongPlaying);

                        if (_song.isCurrentSongPlaying) {
                            setPlayingSongs([_song]);
                            handlePressSong();
                            setSongIsPlaying(_song.isPlaying);
                        } else if (!_song.isCurrentSongPlaying) {
                            setPlayingSongs([_song]);
                            handlePressSong();
                            setSongIsPlaying(_song.isPlaying);
                        }
                    });
            }}
        />
    );
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
    } else if (hasUserVoted(prevProps, nextProps)) {
        return false;
    }
    return true;
};

export default memo(Song);
