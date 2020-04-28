import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { TrackListItem } from './TrackListItem';

export class TrackListItems extends Component {
    render() {
        const {
            isSearchingTracks,
            data,
            trackPressed,
            sendSongToTrackList,
            sendVoteToTrackList,
            sendBoostToTrackList
        } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    windowSize={12} // For performance (default - 21)
                    keyboardShouldPersistTaps="always"
                    data={data} // this.state.searchedTracks - this.state.listTracks
                    renderItem={({ item }) => isSearchingTracks ?
                        <TrackListItem
                            isSearchingTracks={isSearchingTracks}
                            chevron={false}
                            track={item}
                            trackPressed={trackPressed}
                            sendSongToTrackList={sendSongToTrackList}
                            sendVoteToTrackList={sendVoteToTrackList}
                            sendBoostToTrackList={sendBoostToTrackList}
                        /> :
                        <TrackListItem
                            isSearchingTracks={isSearchingTracks}
                            chevron={false}
                            track={item}
                            trackPressed={trackPressed}
                            sendSongToTrackList={sendSongToTrackList}
                            sendVoteToTrackList={sendVoteToTrackList}
                            sendBoostToTrackList={sendBoostToTrackList}
                        />}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}
