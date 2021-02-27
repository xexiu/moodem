/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { memo, useContext, useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { AbstractMedia } from '../../common/functional-components/AbstractMedia';
import { BgImage } from '../../common/functional-components/BgImage';
import { BodyContainer } from '../../common/functional-components/BodyContainer';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { AppContext } from '../../User/functional-components/AppContext';
import { SongsList } from './SongsList';

function setMediaIndex(song: any, index: number) {
    Object.assign(song, {
        index
    });
}

export const Songs = memo((props: any) => {
    const { group } = useContext(AppContext) as any;
    const [songs, setSongs] = useState([]);
    const [items, setItems] = useState([]);
    const [isLoading, setIsloading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const media = new AbstractMedia();

    useEffect(() => {
        console.log('3. Songs');
        media.on('send-message-media', (_songs: any) => {
            _songs.forEach(setMediaIndex);
            setSongs([..._songs]);
            setIsloading(false);
        });
        media.emit('send-message-media', { chatRoom: group.group_name });
        return () => {
            console.log('2. OFF EFFECT Songs');
            media.destroy();
        };
    }, [group]);

    const sendMediaToServer = (song: object) => {
        setSongs([]);
        setIsSearching(false);

        Object.assign(song, {
            isMediaOnList: true,
            index: songs.length
        });

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
                media.checkIfAlreadyOnList(songs, filteredSongs);
                setIsSearching(!!filteredSongs.length);
                setItems([...filteredSongs]);
            }))
            .catch(err => { });
    };

    const resetSearch = () => {
        media.searchRef.current.clear();
        media.searchRef.current.blur();
        setIsSearching(false);
        Keyboard.dismiss();
        return true;
    };

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

    console.log('Rendering Songs...');

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => {
                    resetSearch();
                    props.navigation.openDrawer();
                }}
                customStyle={{ top: -5, left: 0, width: 30, height: 30 }}
            />
            <CommonTopSearchBar
                placeholder='Encuentra una canción...'
                cancelSearch={() => setIsSearching(false)}
                onEndEditingSearch={onEndEditingSearch}
                searchRef={media.searchRef}
                customStyleContainer={{ width: '85%', marginLeft: 55 }}
            />
            <View style={{ backgroundColor: '#fff', flex: 1 }} onStartShouldSetResponder={resetSearch}>
                <SongsList
                    player={media.playerRef}
                    media={media}
                    handler={sendMediaToServer}
                    items={isSearching ? items : songs}
                    isSearching={isSearching}
                    group={group}
                />
            </View>
        </BodyContainer>
    );
});
