import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { TrackListItem } from './TrackListItem';

export class TrackListItems extends Component {
    render() {
        const {
            data,
            actionOnPressItem
        } = this.props
        return (
            <View style={{ flex: 1 }}>
                <FlatList style={{ border: 0, marginLeft: 10, marginRight: 10 }}
                            windowSize={12}
                            keyboardShouldPersistTaps="always"
                            data={data} // this.state.searchedTracks - this.state.listTracks
                            renderItem={({ item }) => (<TrackListItem itemProps={item} actionOnPressItem={actionOnPressItem} />)}
                            keyExtractor={(item, index) => index.toString()}
                        />
            </View>
        )
    }
}