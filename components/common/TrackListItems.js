import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { TrackListItem } from './TrackListItem';

export class TrackListItems extends Component {
    render() {
        const {
            isSearchingTracks,
            data,
            trackPressed,
            sendSongToTrackList
        } = this.props

        console.log('Called Render TrackListItems()');

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    windowSize={12} // For performance (default - 21)
                    keyboardShouldPersistTaps="always"
                    data={data} // this.state.searchedTracks - this.state.listTracks
                    renderItem={({ item }) => {
                        return isSearchingTracks ?
                            <TrackListItem
                                isSearchingTracks={isSearchingTracks}
                                chevron={false}
                                track={item}
                                trackPressed={trackPressed}
                                sendSongToTrackList={sendSongToTrackList}
                            /> :
                            <TrackListItem
                                isSearchingTracks={isSearchingTracks}
                                chevron={false}
                                track={item}
                                trackPressed={trackPressed}
                                sendSongToTrackList={sendSongToTrackList}
                            />
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}