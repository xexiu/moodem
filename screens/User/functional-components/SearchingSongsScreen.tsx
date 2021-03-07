/* eslint-disable max-len */
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Reactotron from 'reactotron-react-native';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import CommonFlatList from '../../../components/common/functional-components/CommonFlatList';
import PreLoader from '../../../components/common/functional-components/PreLoader';
import { Player } from '../../../components/common/Player';
import { PlayerContainer } from '../../../components/common/PlayerContainer';
import Song from '../../../components/User/functional-components/Song';
import storage, { removeItem, saveUserSearchedSongs } from '../../../src/js/Utils/common/storageConfig';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';

const SearchingSongsScreen = (props: any) => {
    const {
        media,
        group,
        lastSearchText,
        user,
        songsOnGroup,
        searchedText
    } = props.route.params;

    const { navigation } = props;
    const [, setPlayingSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const player = useRef(null);
    const searchedSongsRef = useRef([]);

    useEffect(() => {
        console.log('4. Searching songs...', isLoading);
        // removeItem(user.uid, (error: any) => console.log('removeItem', error));

        // storage.getBatchData([
        //     { key: user.uid }
        // ])
        //     .then(results => {
        //         Reactotron.log('Item with getBatchData 1 ');
        //         results.forEach(result => {
        //             if (result.searchedSongs[searchedText] && result.searchedSongs[searchedText].length) {
        //                 console.log('Already Serached text', result.searchedSongs[searchedText]);
        //                 Reactotron.log('Item with getBatchData 2');
        //                 removeItem(user.id, (error: any) => console.log('removeItem', error));
        //             } else {
        //                 result.searchedSongs[searchedText] = [{ index: 1, song: 1 }];
        //                 storage.save(
        //                     {
        //                         key: user.uid, // Note: Do not use underscore("_") in key!
        //                         data: result,

        //                     // if expires not specified, the defaultExpires will be applied instead.
        //                     // if set to null, then it will never expire.
        //                         expires: 1000 * 3600
        //                     })
        //                     .then(data => {
        //                         console.log('Saved', data);
        //                         console.log('FOUND BATCH', result);
        //                         return;
        //                     });
        //                 console.log('SYNC', storage.sync[user.uid]);
        //             }

        //         });
        //     })
        //     .catch(error => {
        //         console.log('Error getting batch', error);
        //         const saveNewUserSearchedSongs = {
        //             searchedSongs: {}
        //         };
        //         saveNewUserSearchedSongs.searchedSongs[searchedText] = [{ index: 0, song: 0 }];

        //         storage.save(
        //             {
        //                 key: user.uid, // Note: Do not use underscore("_") in key!
        //                 data: saveNewUserSearchedSongs,

        //             // if expires not specified, the defaultExpires will be applied instead.
        //             // if set to null, then it will never expire.
        //                 expires: 1000 * 3600
        //             })
        //             .then(data => {
        //                 console.log('Saved', data);
        //                 return;
        //             });
        //     });

        // storage
        //     .load({
        //         key: user.uid,

        //         // autoSync (default: true) means if data is not found or has expired,
        //         // then invoke the corresponding sync method
        //         autoSync: true,

        //         // syncInBackground (default: true) means if data expired,
        //         // return the outdated data first while invoking the sync method.
        //         // If syncInBackground is set to false, and there is expired data,
        //         // it will wait for the new data and return only after the sync completed.
        //         // (This, of course, is slower)
        //         syncInBackground: true,

        //         // you can pass extra params to the sync method
        //         // see sync example below
        //         syncParams: {
        //             extraFetchOptions: {
        //                 // blahblah
        //             },
        //             someFlag: true
        //         }
        //     })
        //     .then(data => {
        //         Reactotron.log('Item with load()', data.searchedSongs);
        //         // found data go to then()
        //         console.log('Retrieved from storage', data.searchedSongs[searchedText]);
        //         searchedSongsRef.current = data.searchedSongs[searchedText];
        //         debugger;
        //         setIsLoading(false);
        //     })
        //     .catch(err => {
        //         // any exception including data not found
        //         // goes to catch()
        //         console.warn(err.message);
        //         switch (err.name) {
        //         case 'NotFoundError':
        //                 // TODO;
        //             console.warn(
        //                     'User not found in AsyncStorage for searchedsongs... creating searchedsongs for user',
        //                     user.uid
        //                     );

        //             return fetchData();
        //         case 'ExpiredError':
        //                 // TODO
        //             break;
        //         }
        //     });

        navigation.setOptions({
            title: props.route.params.group.group_name,
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false
        });

        fetchData();
    }, [isLoading]);

    async function fetchData() {
        console.log('Already fetched', searchedSongsRef.current);
        return media.getSongData({
            q: searchedText
        }, 'soundcloud_api', 'soundcloud_key')
            .then((data: any) => {
                const _searchedSongs = filterCleanData(data, media.user);
                searchedSongsRef.current = [..._searchedSongs];
                media.checkIfAlreadyOnList(songsOnGroup, _searchedSongs);
                saveUserSearchedSongs(user.uid, _searchedSongs, searchedText);
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
