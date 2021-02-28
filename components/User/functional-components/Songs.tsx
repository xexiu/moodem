/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { memo, useContext, useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import { AbstractMedia } from '../../common/functional-components/AbstractMedia';
import { BgImage } from '../../common/functional-components/BgImage';
import { BodyContainer } from '../../common/functional-components/BodyContainer';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';
import { AppContext } from '../../User/functional-components/AppContext';
import { SongsList } from './SongsList';

function setMediaIndex(song: any, index: number) {
    Object.assign(song, {
        index
    });
}

export const Songs = memo((props: any) => {
    const { group } = useContext(AppContext) as any;
    const [allValues, setAllValues] = useState({
        songs: [],
        isSearching: false,
        isLoading: true
    });
    const media = new AbstractMedia();
    const playerRef = media.playerRef;

    useEffect(() => {
        console.log('3. Songs');

        media.on('send-message-media', (_songs: any) => {
            _songs.forEach(setMediaIndex);
            setAllValues(prev => {
                return { ...prev, songs: [..._songs], isLoading: false, isSearching: false };
            });
        });
        media.emit('send-message-media', { chatRoom: group.group_name });
        return () => {
            console.log('2. OFF EFFECT Songs');
            media.destroy();
        };
    }, []);

    const sendMediaToServer = (song: object) => {
        Object.assign(song, {
            isMediaOnList: true,
            index: allValues.songs.length
        });

        console.log('SENND MEDIA');

        media.emit('send-message-media',
            { song, chatRoom: group.group_name });
    };

    const onEndEditingSearch = (text: string) => {
        return media.getSongData({
            limit: 50,
            q: text
        }, 'soundcloud_api', 'soundcloud_key')
            .then((data => {
                const filteredSongs = filterCleanData(data, media.user);
                media.checkIfAlreadyOnList(allValues.songs, filteredSongs);
                setAllValues(prev => {
                    return { ...prev, songs: [...filteredSongs], isSearching: !!filteredSongs.length };
                });
            }))
            .catch(err => { });
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
                <Player ref={playerRef} tracks={allValues.songs} />
            </PlayerContainer>
            <View style={{ backgroundColor: '#fff', flex: 1 }} onStartShouldSetResponder={resetSearch}>
                <SongsList
                    player={playerRef}
                    media={media}
                    handler={sendMediaToServer}
                    items={allValues.songs}
                    isSearching={allValues.isSearching}
                    group={group}
                />
            </View>
        </BodyContainer>
    );
});
