import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export class TrackListItem extends Component {
    render() {
        const {
            isSearchingTracks,
            chevron = true,
            track,
            trackPressed,
            sendSongToTrackList
        } = this.props

        return (
            <View style={{ position: 'relative' }}>
                <ListItem
                    containerStyle={{ backgroundColor: 'transparent', marginBottom: 0 }}
                    bottomDivider
                    Component={TouchableOpacity}
                    title={track.title}
                    titleStyle={{ padding: 0, marginLeft: -12 }}
                    subtitleStyle={{ fontSize: 14, color: '#999', fontStyle: 'italic', marginLeft: -12 }}
                    subtitle={track.user && track.user.username}
                    titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                    chevron={chevron}
                    checkmark={() => { }}
                    onPress={() => {
                        trackPressed(track);
                    }}
                />
                {
                    isSearchingTracks &&
                    <View style={{ position: 'absolute', right: 0, top: 15 }}>
                        <Icon
                            Component={TouchableScale}
                            name='chevron-right'
                            type='entypo'
                            size={25}
                            color='#dd0031'
                            onPress={() => {
                                sendSongToTrackList(track);
                            }}
                        />
                    </View>
                }
                <View style={{ position: 'absolute', right: 0, bottom:4, flexDirection: 'row' }}>
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