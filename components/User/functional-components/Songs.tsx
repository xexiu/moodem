/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, View } from 'react-native';
import BurgerMenuIcon from '../../common/BurgerMenuIcon';
import BgImage from '../../common/functional-components/BgImage';
import BodyContainer from '../../common/functional-components/BodyContainer';
import CommonFlatList from '../../common/functional-components/CommonFlatList';
import PreLoader from '../../common/functional-components/PreLoader';
import SearchBarAutoComplete from '../../common/functional-components/SearchBarAutoComplete';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { AppContext } from '../../User/functional-components/AppContext';
import SearchedSongsList from './SearchedSongsList';
import Song from './Song';

const Songs = (props: any) => {
    const { media, navigation } = props;
    const { group, user } = useContext(AppContext) as any;
    const [allValues, setAllValues] = useState({
        songs: [],
        searchedSongs: [],
        playingSongs: [],
        isSearching: false,
        isLoading: true,
        isComingFromSearchingSong: false
    });
    const player = useRef(null);

    useEffect(() => {
        console.log('3. Songs');

        media.on('send-message-media', ({ songs, isComingFromSearchingSong }: any) => {
            setAllValues(prev => {
                return {
                    ...prev, songs:
                        [...songs],
                    isLoading: false,
                    isSearching: false,
                    isComingFromSearchingSong
                };
            });
        });
        media.emit('send-message-media', { chatRoom: group.group_name });

        return () => {
            console.log('3. OFF EFFECT Songs');
            media.destroy();
        };
    }, []);

    const resetSearch = () => {
        setAllValues(prev => {
            return {
                ...prev,
                isSearching: false,
                isComingFromSearchingSong: true
            };
        });
        Keyboard.dismiss();
        return true;
    };

    const keyExtractor = (item: any) => item.index.toString();

    const handlePressSong = (song: any) => {
        setAllValues(prevSongs => {
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
                    isPlaying: !player.current.state.paused,
                    currentSong: true
                });
            }
            return { ...prevSongs, playingSongs: [song, ...playingSongs] };
        });
    };

    const renderItem = ({ item }: any) => {
        return (<Song
            song={item}
            media={media}
            player={player}
            isSearching={allValues.isSearching}
            group={group}
            user={user}
            handlePressSong={(song: any) => handlePressSong(song)}
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

    console.log('Render songs');

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => {
                    navigation.openDrawer();
                }}
            />
            <SearchBarAutoComplete
                group={group}
                user={user}
                songsOnGroup={allValues.songs}
                navigation={navigation}
                media={media}
            />
            <PlayerContainer items={allValues.songs}>
                <Player
                    ref={player}
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
                    onContentSizeChange={(w, h) => {
                        if (allValues.isComingFromSearchingSong) {
                            media.flatListRef.current.scrollToEnd({
                                animated: true
                            });
                        }
                    }}
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
