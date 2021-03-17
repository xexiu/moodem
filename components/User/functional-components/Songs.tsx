
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
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
        isLoading: true,
        isComingFromSearchingSong: false
    });
    const player = useRef(null);
    const repeatRef = useRef(null);

    useEffect(() => {
        media.on('get-medias-group', ({ songs, isComingFromSearchingSong }: any) => {
            setAllValues(prev => {
                return {
                    ...prev,
                    songs: [...songs],
                    isLoading: false,
                    isComingFromSearchingSong
                };
            });
        });
        media.emit('emit-medias-group', { chatRoom: group.group_name });

        return () => {
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
            const { songs } = prevSongs;
            const isCurrentSong = songs.includes(song.id);

            if (songs.length) {
                songs.forEach(_song => {
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
            return { ...prevSongs, song };
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
            handlePressSong={handlePressSong}
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
    }

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
            <Player
                repeatRef={repeatRef}
                ref={player}
                user={user}
                player={player}
                tracks={allValues.songs}
            />
        </BodyContainer>
    );
};

Songs.propTypes = {
    media: PropTypes.any,
    navigation: PropTypes.any
};

export default memo(Songs);
