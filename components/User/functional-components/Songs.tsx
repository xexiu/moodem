/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import BurgerMenuIcon from '../../common/BurgerMenuIcon';
import BgImage from '../../common/functional-components/BgImage';
import BodyContainer from '../../common/functional-components/BodyContainer';
import CommonFlatList from '../../common/functional-components/CommonFlatList';
import CommonTopSearchBar from '../../common/functional-components/CommonTopSearchBar';
import PreLoader from '../../common/functional-components/PreLoader';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { AppContext } from '../../User/functional-components/AppContext';
import SearchedSongsList from './SearchedSongsList';
import Song from './Song';

const LIMIT_RESULT_SEARCHED_SONGS = 20;

const Songs = (props: any) => {
    const { media, navigation } = props;
    const { group, user } = useContext(AppContext) as any;
    const [allValues, setAllValues] = useState({
        songs: [],
        searchedSongs: [],
        playingSongs: [],
        isSearching: false,
        isLoading: true
    });

    useEffect(() => {
        console.log('3. Songs');

        media.on('send-message-media', (songs: any) => {
            setAllValues(prev => {
                return { ...prev, songs: [...songs], isLoading: false, isSearching: false };
            });
        });
        media.emit('send-message-media', { chatRoom: group.group_name });

        return () => {
            console.log('2. OFF EFFECT Songs');
            media.destroy();
        };
    }, []);

    const onEndEditingSearch = (text: string) => {
        return media.getSongData({
            limit: LIMIT_RESULT_SEARCHED_SONGS,
            q: text
        }, 'soundcloud_api', 'soundcloud_key')
            .then((data: any) => {
                const filteredSongs = filterCleanData(data, media.user);
                media.checkIfAlreadyOnList(allValues.songs, filteredSongs);
                setAllValues(prev => {
                    return { ...prev, searchedSongs: [...filteredSongs], isSearching: !!filteredSongs.length };
                });
                Promise.resolve();
            })
            .catch((err: any) => { });
    };

    const resetSearch = () => {
        setAllValues(prev => {
            return { ...prev, isSearching: false };
        });
        Keyboard.dismiss();
        return true;
    };

    const keyExtractor = (item: any) => item.index.toString();

    const onClickUseCallBack = useCallback((song, isPlaying) => {
        return setAllValues(prevSongs => {
            const { playingSongs } = prevSongs;
            const isCurrentSong = playingSongs.includes(song.id);

            if (playingSongs.length) {
                playingSongs.forEach(_song => {
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
                    isPlaying,
                    currentSong: true
                });
            }
            return { ...prevSongs, playingSongs: [song, ...playingSongs] };
        });
    }, []);

    const renderItem = ({ item }: any) => {
        return (<Song
            song={item}
            media={media}
            isSearching={allValues.isSearching}
            group={group}
            user={user}
            handlePressSong={(song: any, isPlaying: boolean) => onClickUseCallBack(song, isPlaying)}
        />);
    };

    if (allValues.isLoading) {
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
    } else if (allValues.isSearching) {
        return (
            <SearchedSongsList
                renderItem={renderItem}
                media={media}
                resetSearch={resetSearch}
                searchedSongs={allValues.searchedSongs}
            />
        );
    }

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => {
                    navigation.openDrawer();
                }}
            />
            <CommonTopSearchBar
                placeholder='Encuentra una canción...'
                cancelSearch={() => {
                    setAllValues(prev => {
                        return { ...prev, isSearching: false };
                    });
                }}
                onEndEditingSearch={onEndEditingSearch}
                searchRef={media.searchRef}
            />
            <PlayerContainer items={allValues.songs}>
                <Player
                    ref={media.playerRef}
                    tracks={allValues.songs}
                />
            </PlayerContainer>
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
                <CommonFlatList
                    reference={media.flatListRef}
                    data={allValues.songs}
                    extraData={allValues.searchedSongs}
                    keyExtractor={keyExtractor}
                    action={renderItem}
                />
            </View>
        </BodyContainer>
    );
};

Songs.propTypes = {
    media: PropTypes.any,
    navigation: PropTypes.any
};

export default memo(Songs);
