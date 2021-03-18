import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import CommonFlatListItem from '../../common/functional-components/CommonFlatListItem';
import PreLoader from '../../common/functional-components/PreLoader';
import { MediaButtons } from './MediaButtons';

const Song = (props: any) => {
    const {
        song,
        user,
        media,
        isSearching,
        group,
        playPauseRef,
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
    }, [isFocused]);

    return (
            <CommonFlatListItem
                bottomDivider
                title={song.videoDetails.title}
                titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                subtitle={song.videoDetails.author.name.replace('VEVO', '')}
                subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
                leftAvatar={{
                    source: { uri: song.isPlaying ?
                        'https://thumbs.gfycat.com/DifficultAjarJanenschia-small.gif' :
                        song.videoDetails.thumbnails[0].url }
                }}
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
                    playPauseRef.current.onPressHandler(song);
                }}
            />
    );
};

const hasUserVoted = (nextProps: any) => {
    return nextProps.song.voted_users.includes(nextProps.user.uid);
};

const areEqual = (prevProps: any, nextProps: any) => {
    console.log('PREVV', prevProps, 'NExtt', nextProps);
    const songPrev = prevProps.song;
    const songNext = nextProps.song;

    if (songPrev.index === songNext.index &&
        songPrev.isPlaying && songNext.isPlaying ||
        hasUserVoted(nextProps)
        ) {
        return false;
    } else if (songPrev.index === songNext.index &&
        !songPrev.isPlaying &&
        !songNext.isPlaying || hasUserVoted(nextProps)
        ) {
        return false;
    }
    return true;
};

export default memo(Song, areEqual);
