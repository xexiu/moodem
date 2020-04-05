import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';

function getArtists(artists) {
    const _artisits = [];
    artists.map(artist => { _artisits.push(artist.name)});

    return _artisits.join(', ');
}

export class TrackListItem extends Component {
    render() {
        const {
            track,
            trackPressed = () => { console.log('Item from list has been pressed!') }
        } = this.props

        return (
            <View>
                <ListItem
                    bottomDivider
                    Component={TouchableOpacity}
                    title={track.name}
                    subtitleStyle={{ fontSize:14, color: '#999', fontStyle: 'italic' }}
                    subtitle={getArtists(track.artists)}
                    titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                    onPress={() => {
                        this.props.trackPressed(track);
                    }}
                />
            </View>
        )
    }
}