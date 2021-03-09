/* eslint-disable max-len */
import { resolvePlugin } from '@babel/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import ytdl from 'react-native-ytdl';
import Reactotron from 'reactotron-react-native';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import CommonFlatList from '../../../components/common/functional-components/CommonFlatList';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import { Player } from '../../../components/common/Player';
import { PlayerContainer } from '../../../components/common/PlayerContainer';
import Song from '../../../components/User/functional-components/Song';
import storage, { removeItem, saveUserSearchedSongs } from '../../../src/js/Utils/common/storageConfig';
import { setExtraAttrs } from '../../../src/js/Utils/Helpers/actions/songs';

const SearchingSongsScreen = (props: any) => {
    const {
        media,
        group,
        user,
        songsOnGroup,
        searchedText
    } = props.route.params;

    const { navigation } = props;
    const [, setPlayingSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const player = useRef(null);
    const searchedSongsRef = useRef([]);
    const isFocused = useIsFocused();

    function getResultsForSearch() {
        return new Promise((resolve, reject) => {
            // make fetch to youtube search
            // get only the videoId
            // const resp = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchedText}&maxResults=20&videoCategoryId=10&type=video&key=AIzaSyCNAtpEYrSP4SCmk4FnXB0DxAw_JefBcGw`);

            resolve(['8SbUC-UaAxE', 'tAGnKpE4NCI', 'aw_cmzF_uZY', 'iuTtlb2COtc']);

        });
    }

    useEffect(() => {
        console.log('4. Searching songs screen...', isLoading);
        getResultsForSearch()
        .then((videoIds: any) => {
            media.emit('get-songs-from-youtube', { chatRoom: group.group_name, videoIds });
        });
        media.on('get-songs-from-youtube', (data: any) => {
            const _searchedSongs = setExtraAttrs(data.audios, media.user);
            searchedSongsRef.current = [..._searchedSongs];
            media.checkIfAlreadyOnList(songsOnGroup, _searchedSongs);
            console.log('Searchedsongs', searchedSongsRef.current);
            setIsLoading(false);
        });

        navigation.setOptions({
            title: props.route.params.group.group_name,
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false
        });

        return () => {
            console.log('3. OFF SearchingSongsScreen');
            media.destroy();
        };
    }, [isFocused]);

    // const handlePressSong = (song: any) => {
    //     setPlayingSongs(prevSongs => {
    //         const isCurrentSong = prevSongs.includes(song.id);

    //         if (prevSongs.length) {
    //             prevSongs.forEach(_song => {
    //                 _song.currentSong && delete _song.currentSong;
    //                 _song.isPrevSong && delete _song.isPrevSong;

    //                 Object.assign(_song, {
    //                     isPrevSong: true,
    //                     isPlaying: false
    //                 });
    //             });
    //         }

    //         if (!isCurrentSong) {
    //             Object.assign(song, {
    //                 isPlaying: !player.current.state.paused,
    //                 currentSong: true
    //             });
    //         }
    //         return [song, ...prevSongs];
    //     });
    // };

    const keyExtractor = (item: any) => item.index.toString();

    const sendMediaToServer = (song: any) => {
        Object.assign(song, {
            isMediaOnList: true
        });

        media.emit('send-message-media', { song, chatRoom: group.group_name, isComingFromSearchingSong: true });
        navigation.goBack();
    };

    const renderItem = ({ item }: any) => {
        console.log('Itemmm to render', item);
        return (<Song
            song={item}
            media={media}
            group={group}
            user={user}
            player={player}
            isSearching={!!searchedSongsRef.current.length}
            sendMediaToServer={sendMediaToServer}
        />);
    };

    if (isLoading) {
        return (
            <View>
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
        <BodyContainer customBodyContainerStyle={{ paddingTop: 10 }}>
            <PlayerContainer items={searchedSongsRef.current}>
                <Player
                    ref={player}
                    tracks={searchedSongsRef.current}
                />
            </PlayerContainer>
            <CommonFlatList
                reference={media.flatListRef}
                data={searchedSongsRef.current}
                extraData={searchedSongsRef.current}
                keyExtractor={keyExtractor}
                action={renderItem}
            />
        </BodyContainer>
    );
};

export default memo(SearchingSongsScreen);
