/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import { BgImage } from '../../common/functional-components/BgImage';
import { BodyContainer } from '../../common/functional-components/BodyContainer';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import CommonTopSearchBar from '../../common/functional-components/CommonTopSearchBar';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { AppContext } from '../../User/functional-components/AppContext';
import Song from './Song';

const Songs = (props: any) => {
    const { media } = props;
    const { group } = useContext(AppContext) as any;
    const [allValues, setAllValues] = useState({
        songs: [],
        isSearching: false,
        isLoading: true
    });
    const [playingSongs, setPlayingSongs] = useState([]);

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
            limit: 50,
            q: text
        }, 'soundcloud_api', 'soundcloud_key')
            .then((data: any) => {
                const filteredSongs = filterCleanData(data, media.user);
                media.checkIfAlreadyOnList(allValues.songs, filteredSongs);
                setAllValues(prev => {
                    return { ...prev, songs: [...filteredSongs], isSearching: !!filteredSongs.length };
                });
            })
            .catch((err: any) => { });
    };

    const resetSearch = () => {
        media.searchRef.current.clear();
        media.searchRef.current.blur();
        setAllValues(prev => {
            return { ...prev, isSearching: false };
        });
        Keyboard.dismiss();
        return true;
    };

    const keyExtractor = (item: any) => item.index.toString();

    const onClickUseCallBack = useCallback((song, isPlaying) => {
        return setPlayingSongs(prevSongs => {
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
                    isPlaying,
                    currentSong: true
                });
            }
            return [song, ...playingSongs];
        });
    }, []);

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

    const renderItem = ({ item }: any) => {
        return (<Song
            song={item}
            media={media}
            isSearching={allValues.isSearching}
            group={group}
            handlePressSong={(song: any, isPlaying: boolean) => onClickUseCallBack(song, isPlaying)}
        />);
    };

    return (
        <BodyContainer>
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
                <Player ref={media.playerRef} tracks={allValues.songs} />
            </PlayerContainer>
            <View style={{ backgroundColor: '#fff', flex: 1 }} onStartShouldSetResponder={resetSearch}>
                <CommonFlatList
                    reference={media.flatListRef}
                    data={allValues.songs}
                    extraData={playingSongs}
                    keyExtractor={keyExtractor}
                    action={renderItem}
                />
            </View>
        </BodyContainer>
    );
};

Songs.propTypes = {
    media: PropTypes.any
};

export default memo(Songs);
