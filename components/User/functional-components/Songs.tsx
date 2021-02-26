/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { memo, useContext, useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { AbstractMedia } from '../../common/functional-components/AbstractMedia';
import { CommonTopSearchBar } from '../../common/functional-components/CommonTopSearchBar';
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
    const [isSearching, setIsSearching] = useState(false);
    const media = new AbstractMedia();

    useEffect(() => {
        console.log('2. Songs');
        console.log('Songs group', group);
        media.on('send-message-media', (_songs: any) => {
            _songs.forEach(setMediaIndex);
            setSongs([..._songs]);
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

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
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
                    media={media}
                    handler={sendMediaToServer}
                    items={isSearching ? items : songs}
                    isSearching={isSearching}
                    routeGroup={props.route.params.group}
                />
            </View>
        </View>
    );
});
