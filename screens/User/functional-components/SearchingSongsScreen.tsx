/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import CommonFlatList from '../../../components/common/functional-components/CommonFlatList';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import { Player } from '../../../components/common/Player';
import { PlayerContainer } from '../../../components/common/PlayerContainer';
import Song from '../../../components/User/functional-components/Song';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';

const SearchingSongsScreen = (props: any) => {
    const {
        media,
        group,
        searchedText,
        lastSearchText,
        user,
        songsOnGroup
    } = props.route.params;
    const { navigation } = props;
    const [, setPlayingSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const player = useRef(null);
    const searchedSongsRef = useRef([]);

    useEffect(() => {
        console.log('4. Searching songs...');
        navigation.setOptions({
            title: props.route.params.group.group_name,
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false
        });

        fetchData();
    }, [lastSearchText]);

    async function fetchData() {
        console.log('Already fetched', searchedSongsRef.current);
        return media.getSongData({
            q: searchedText
        }, 'soundcloud_api', 'soundcloud_key')
            .then((data: any) => {
                const _searchedSongs = filterCleanData(data, media.user);
                searchedSongsRef.current = [..._searchedSongs];
                media.checkIfAlreadyOnList(songsOnGroup, _searchedSongs);
                setIsLoading(false);
            })
            .catch((err: any) => { });
    }

    const handlePressSong = (song: any) => {
        setPlayingSongs(prevSongs => {
            const isCurrentSong = prevSongs.includes(song.id);

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
            return [song, ...prevSongs];
        });
    };

    const keyExtractor = (item: any) => item.index.toString();

    const sendMediaToServer = (song: any) => {
        Object.assign(song, {
            isMediaOnList: true
        });

        media.emit('send-message-media', { song, chatRoom: group.group_name, isComingFromSearchingSong: true });
        navigation.goBack();
    };

    const renderItem = ({ item }: any) => {
        return (<Song
            song={item}
            media={media}
            group={group}
            user={user}
            player={player}
            isSearching={!!searchedSongsRef.current.length}
            sendMediaToServer={sendMediaToServer}
            handlePressSong={(song: any) => handlePressSong(song)}
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
