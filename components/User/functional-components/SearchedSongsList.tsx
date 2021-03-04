/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import BodyContainer from '../../common/functional-components/BodyContainer';
import CommonFlatList from '../../common/functional-components/CommonFlatList';
import { Player } from '../../common/Player';
import { PlayerContainer } from '../../common/PlayerContainer';

const SearchedSongsList = (props: any) => {
    const {
        renderItem,
        media,
        searchedSongs,
        resetSearch
    } = props;

    const keyExtractor = (item: any) => item.index.toString();

    return (
        <BodyContainer>
            <Icon
                containerStyle={{ position: 'absolute', left: 10, width: 50, height: 20, zIndex: 100 }}
                Component={TouchableScale}
                name='back'
                type='entypo'
                size={25}
                color='#dd0031'
                onPress={() => resetSearch()}
            />
            <PlayerContainer items={searchedSongs}>
                <Player
                    ref={media.playerRef}
                    tracks={searchedSongs}
                />
            </PlayerContainer>
            <View style={{ backgroundColor: '#fff', flex: 1 }} onStartShouldSetResponder={resetSearch}>
                <CommonFlatList
                    reference={media.flatListRef}
                    data={searchedSongs}
                    extraData={searchedSongs}
                    keyExtractor={keyExtractor}
                    action={renderItem}
                />
            </View>
        </BodyContainer>
    );
};

SearchedSongsList.propTypes = {
    renderItem: PropTypes.func,
    media: PropTypes.any,
    searchedSongs: PropTypes.array,
    resetSearch: PropTypes.func
};

export default memo(SearchedSongsList);
