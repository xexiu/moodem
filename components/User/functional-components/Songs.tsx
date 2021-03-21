
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import BurgerMenuIcon from '../../common/BurgerMenuIcon';
import BgImage from '../../common/functional-components/BgImage';
import BodyContainer from '../../common/functional-components/BodyContainer';
import CommonFlatList from '../../common/functional-components/CommonFlatList';
import PreLoader from '../../common/functional-components/PreLoader';
import SearchBarAutoComplete from '../../common/functional-components/SearchBarAutoComplete';
import Player from '../../common/Player';
import { AppContext } from '../../User/functional-components/AppContext';
import SearchedSongsList from './SearchedSongsList';
import Song from './Song';

function setMediaIndex(song: any, index: number) {
    Object.assign(song, {
        index,
        isPlaying: false
    });
}

const Songs = (props: any) => {
    const { media, navigation } = props;
    const { group } = useContext(AppContext) as any;
    const [allValues, setAllValues] = useState({
        songs: [],
        isLoading: true,
        isComingFromSearchingSong: false
    });
    const player = useRef(null);
    const basePlayer = useRef(null);
    const flatListRef = useRef(null);
    const repeatRef = useRef(null);
    const playPauseRef = useRef(null);
    const seekRef = useRef(null);
    const playerInstance = (<Player
        isSearching={allValues.isComingFromSearchingSong}
        navigation={navigation}
        ref={player}
        player={player}
        basePlayer={basePlayer}
        flatListRef={flatListRef}
        repeatRef={repeatRef}
        playPauseRef={playPauseRef}
        seekRef={seekRef}
        renderItem={(item: any, index: number) => renderItem(item, index)}
        media={media}
        tracks={allValues.songs}
    />);

    useEffect(() => {
        console.log('Focused SOngs');
        media.on('get-medias-group', ({ songs, isComingFromSearchingSong }: any) => {
            songs.forEach(setMediaIndex);
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
            // media.destroy();
            media.socket.off(media.on);
            console.log('OFF Focused SOngs');
        };
    }, []);

    const renderItem = useCallback((item, index) => {
        return (<Song
            player={media.player}
            song={item}
            media={media}
            playPauseRef={playPauseRef}
            flatListRef={flatListRef}
        />);
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

    console.log('Render Songs');

    const resetLoadingSongs = (loading: boolean) => {
        setAllValues(prev => {
            return {
                ...prev,
                isLoading: loading
            };
        });
    };

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => {
                    navigation.openDrawer();
                }}
            />
            <SearchBarAutoComplete
                group={group}
                songsOnGroup={allValues.songs}
                navigation={navigation}
                media={media}
                resetLoadingSongs={resetLoadingSongs}
            />
            {playerInstance}
        </BodyContainer>
    );
};

Songs.propTypes = {
    media: PropTypes.any,
    navigation: PropTypes.any
};

export default memo(Songs);
