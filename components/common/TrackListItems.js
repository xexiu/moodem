import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { TrackListItem } from './TrackListItem';

export class TrackListItems extends Component {
    render() {
        const {
            data,
            trackItemPressed
        } = this.props

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    windowSize={12}
                    keyboardShouldPersistTaps="always"
                    data={data} // this.state.searchedTracks - this.state.listTracks
                    renderItem={({ item }) => (<TrackListItem track={item} trackPressed={trackItemPressed} />)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}