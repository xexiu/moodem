import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ListItem, Icon, Button } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export class TrackListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markCurrentTrack: false,
            currentTrack: {}
        }
    }
    render() {
        const {
            markCurrentTrack
        } = this.state;
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
                    subtitle={
                        <View style={{ position: 'relative', height: 35, marginBottom: 5 }}>
                            <Text style={{ fontSize: 14, color: '#999', fontStyle: 'italic', marginLeft: -12 }}>{track.user && track.user.username}</Text>
                            <View style={{ flexDirection: 'row', height: 22, position: 'absolute', bottom: -15, left: -10 }}>
                                <Button
                                    buttonStyle={{ margin: 0, padding: 3, backgroundColor: '#90c520' }}
                                    containerStyle={{ marginRight: 5 }}
                                    titleStyle={{ fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}
                                    raised={true}
                                    icon={
                                        <Icon
                                            name="thumbs-up"
                                            type='entypo'
                                            size={15}
                                            color="white"
                                        />
                                    }
                                    title=""
                                    onPress={() => console.log('Pressed vote')}
                                />
                                <Button
                                    buttonStyle={{ margin: 0, padding: 3, backgroundColor: '#00b7e0' }}
                                    containerStyle={{ marginRight: 5 }}
                                    titleStyle={{ fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}
                                    raised={true}
                                    icon={
                                        <Icon
                                            name="thunder-cloud"
                                            type='entypo'
                                            size={15}
                                            color="white"
                                        />
                                    }
                                    title=""
                                    onPress={() => console.log('Pressed boost')}
                                />
                                {
                                    !isSearchingTracks &&
                                    <Button
                                        buttonStyle={{ margin: 0, padding: 4, backgroundColor: '#dd0031' }}
                                        containerStyle={{ marginRight: 5 }}
                                        titleStyle={{ fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}
                                        raised={true}
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
                                }
                            </View>
                        </View>
                    }
                    titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                    chevron={isSearchingTracks && { color: '#dd0031', onPress: () => sendSongToTrackList(track), size: 10, raised: true, Component: TouchableOpacity, iconStyle: { fontSize: 15, paddingLeft: 2 } }}
                    checkmark={() => { }}
                    onPress={() => {
                        this.setState({
                            markCurrentTrack: true
                        });
                        trackPressed(track);
                    }}
                />
                {/* {
                    isSearchingTracks &&
                    <View style={{ position: 'absolute', right: 0, top: 15, paddingLeft: 10 }}>
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
                        <View style={{ position: 'absolute', right: 0, bottom: -30, flexDirection: 'row' }}>
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
                } */}
            </View>
        )
    }
}