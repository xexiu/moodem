import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';

function getArtists(artists) {
    const _artisits = [];
    artists.map(artist => { _artisits.push(artist.name) });

    return _artisits.join(', ');
}

export class TrackListItem extends Component {
    render() {
        const {
            track,
            trackPressed = () => { console.log('Item from list has been pressed!') }
        } = this.props

        return (
            <View style={{ position: 'relative' }}>
                <ListItem
                    containerStyle={{ backgroundColor: 'transparent', marginBottom: 10 }}
                    bottomDivider
                    Component={TouchableOpacity}
                    title={track.title}
                    titleStyle={{ padding: 0, marginLeft: -12 }}
                    subtitleStyle={{ fontSize: 14, color: '#999', fontStyle: 'italic', marginLeft: -12 }}
                    subtitle={track.user && track.user.username}
                    titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                    chevron={true}
                    checkmark={() => { }}
                    onPress={() => {
                        this.props.trackPressed(track);
                    }}
                />
                <View style={{ position: 'absolute', right: 0, bottom: 12, flexDirection: 'row' }}>
                    <View style={{ marginRight: 3 }}>
                        <Icon
                            name='heart-o'
                            type='font-awesome'
                            size={10}
                            color='#dd0031'
                        />
                    </View>
                    <View style={{ marginBottom: 2 }}>
                        <Text style={{ fontSize: 10, fontStyle: 'italic', color: '#999' }}>
                            {track.likes_count}</Text>
                    </View>
                </View>
            </View>
        )
    }
}