
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import BurgerMenuIcon from '../../common/BurgerMenuIcon';
import BodyContainer from '../../common/functional-components/BodyContainer';
import PreLoader from '../../common/functional-components/PreLoader';
import SearchBarAutoComplete from '../../common/functional-components/SearchBarAutoComplete';
import { AppContext } from '../../User/functional-components/AppContext';
import Song from './Song';
import SongsList from './SongsList';

const Songs = (props: any) => {
    const { media, navigation } = props;
    const { group } = useContext(AppContext) as any;
    const [allValues, setAllValues] = useState({
        songs: [],
        isLoading: true,
        isComingFromSearchingSong: false,
        isRemovingSong: false,
        isVoting: false
    });
    const songsListRef = useRef(null);

    useEffect(() => {
        media.on('get-medias-group', (data: any) => {
            setAllValues(prev => {
                return {
                    ...prev,
                    songs: [...data.songs],
                    isLoading: false,
                    isComingFromSearchingSong: data.isComingFromSearchingSong || false,
                    isRemovingSong: data.isRemovingSong || false,
                    isVoting: data.isVoting || false
                };
            });
        });
        media.emit('emit-medias-group', { chatRoom: group.group_name });

        return () => {
            // media.destroy();
            media.socket.off('emit-medias-group');
            media.socket.off('get-medias-group');
        };
    }, []);

    if (allValues.isLoading) {
        return (
            <PreLoader
                containerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                size={50}
            />
        );
    }

    const resetLoadingSongs = (loading: boolean) => {
        setAllValues(prev => {
            return {
                ...prev,
                isLoading: loading
            };
        });
    };

    const setIsGoingToSearching = (isSearching: boolean) => {
        setAllValues(prev => {
            return {
                ...prev,
                isSearching
            };
        });
    };

    const renderItem = (item: any, handlePress: Function, currentSong: any) => {
        return (<Song
            group={group}
            isSearching={false}
            isComingFromSearchingSong={allValues.isComingFromSearchingSong}
            song={item}
            isPlaying={item.isPlaying}
            currentSong={currentSong}
            media={media}
            handlePress={() => {
                return handlePress(currentSong);
            }}
        />);
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
                setIsGoingToSearching={setIsGoingToSearching}
            />
            <SongsList
                ref={songsListRef}
                isSearching={false}
                isComingFromSearchingSong={allValues.isComingFromSearchingSong}
                isRemovingSong={allValues.isRemovingSong}
                isVoting={allValues.isVoting}
                data={allValues}
                renderItem={renderItem}
            />
        </BodyContainer>
    );
};

Songs.propTypes = {
    media: PropTypes.any,
    navigation: PropTypes.any
};

export default memo(Songs);
