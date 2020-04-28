/* eslint-disable max-len */
import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ListItem, Icon, Button } from 'react-native-elements';

export class TrackListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markCurrentTrack: false,
            currentTrack: {},
            hasVoted: false,
            hasBoosted: false,
            isRegistered: !0
        };
    }

    trackItemOnSearchList = (track) => (
            <View style={{ marginBottom: 2, position: 'absolute', left: 0, bottom: -15, marginLeft: -12 }}>
                <Text style={{ fontSize: 10, fontStyle: 'italic', color: '#999' }}>Likes: {track.likes_count}</Text>
            </View>
        )

    trackItemList = (track, sendVoteToTrackList, sendBoostToTrackList) => (
            <View>
                <View style={{ flexDirection: 'row', height: 22, position: 'absolute', bottom: -30, left: -10 }}>
                    <Button
                        disabled={this.state.isRegistered}
                        buttonStyle={{ margin: 0, padding: 3, backgroundColor: '#90c520' }}
                        containerStyle={{ marginRight: 5 }}
                        titleStyle={{ fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}
                        raised
                        icon={
                            <Icon
                                name="thumbs-up"
                                type='entypo'
                                size={15}
                                color="white"
                            />
                        }
                        title=""
                        onPress={() => {
                            this.setState({
                                hasVoted: true
                            });
                            sendVoteToTrackList(track.id, ++track.votes_count);
                        }}
                    />
                    <Button
                        disabled={this.state.isRegistered}
                        buttonStyle={{ margin: 0, padding: 3, backgroundColor: '#00b7e0' }}
                        containerStyle={{ marginRight: 5 }}
                        titleStyle={{ fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}
                        raised
                        icon={
                            <Icon
                                name="thunder-cloud"
                                type='entypo'
                                size={15}
                                color="white"
                            />
                        }
                        title=""
                        onPress={() => {
                            this.setState({
                                hasBoosted: true
                            });
                            sendBoostToTrackList(track.id, ++track.boosts_count);
                        }}
                    />
                    <Button
                        disabled={this.state.isRegistered}
                        buttonStyle={{ margin: 0, padding: 4, backgroundColor: '#dd0031' }}
                        containerStyle={{ marginRight: 5 }}
                        titleStyle={{ fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}
                        raised
                        icon={
                            <Icon
                                name="remove"
                                type='font-awesome'
                                size={15}
                                color="white"
                            />
                        }
                        title=""
                        onPress={() => console.log('Pressed Remove')}
                    />
                </View>
                <View style={{ position: 'absolute', right: 0, bottom: -30, flexDirection: 'row' }}>
                    <Icon
                        name="thumbs-up"
                        type='entypo'
                        size={15}
                        color="#90c520"
                    />
                    <Text style={{ fontSize: 14, color: '#777', marginLeft: 2 }}>{track.votes_count}</Text>
                    <Icon
                        iconStyle={{ marginLeft: 4 }}
                        name="thunder-cloud"
                        type='entypo'
                        size={17}
                        color="#00b7e0"
                    />
                    <Text style={{ fontSize: 14, color: '#777', marginLeft: 4 }}>{track.boosts_count}</Text>
                </View>
            </View>
        )
    render() {
        const {
            isSearchingTracks,
            track,
            trackPressed,
            sendSongToTrackList,
            sendVoteToTrackList,
            sendBoostToTrackList
        } = this.props;

        return (
            <View style={{ position: 'relative' }}>
                <ListItem
                    containerStyle={{ backgroundColor: 'transparent', marginBottom: 0 }}
                    bottomDivider
                    Component={TouchableOpacity}
                    title={track.title}
                    titleStyle={{ padding: 0, marginLeft: -12 }}
                    subtitle={
                        <View style={[{ position: 'relative' }, !isSearchingTracks && { height: 35, marginBottom: 5 }]}>
                            <Text style={{ fontSize: 14, color: '#999', fontStyle: 'italic', marginLeft: -12 }}>{track.user && track.user.username}</Text>
                            {isSearchingTracks && this.trackItemOnSearchList(track)}
                            {!isSearchingTracks && this.trackItemList(track, sendVoteToTrackList, sendBoostToTrackList)}
                        </View>
                    }
                    titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                    chevron={isSearchingTracks && !track.isOnTracksList && { color: '#dd0031', onPress: () => sendSongToTrackList(track), size: 10, raised: true, Component: TouchableOpacity, iconStyle: { fontSize: 15, paddingLeft: 2 } }}
                    checkmark={isSearchingTracks && track.isOnTracksList}
                    onPress={() => {
                        this.setState({
                            markCurrentTrack: true
                        });
                        trackPressed(track);
                    }}
                />
            </View>
        );
    }
}
