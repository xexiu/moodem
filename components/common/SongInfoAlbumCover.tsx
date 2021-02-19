import React, { Component } from 'react';
import { View, Image } from 'react-native';

export class SongInfoAlbumCover extends Component {
	public props: any;
	public songAlbumCover: any;

    render() {
        const {
            songAlbumCover
        } = this.props;

        return (
            <View style={{ height: 100, flexDirection: 'row', justifyContent: 'center' }}>
                <Image
                    style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: '#ddd' }}
                    source={{ uri: songAlbumCover, cache: 'force-cache' }}
                />
            </View>
        );
    }
}
