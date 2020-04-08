import axios from 'axios';
import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import { Dimensions } from 'react-native';
import { getSoundCloudTacks } from '../../src/js/Api/soundCloudApi';

const MARGIN_RIGHT = 80;
const {
    width
} = Dimensions.get('window');

function filterCleanData(data) {
    const filteredTracks = [];

    data.forEach(track => {
        if (track.kind === 'track' && track.streamable) {
            filteredTracks.push({
                id: track.id,
                created_at: track.created_at,
                last_modified: track.last_modified,
                title: track.title,
                duration: track.duration,
                stream_url: track.stream_url,
                genre: track.genre,
                streamable: track.streamable,
                user: {
                    username: track.user && track.user.username || 'Anonymous'
                },
                likes_count: track.likes_count,
                video_url: track.video_url,
                download_url: track.download_url
            });
        }
    });

    return filteredTracks;
}

function updateSearch(searchText) {
    this.setState({
        searchText,
        clearIconState: true
    });
};

function clearSearch() {
    console.log('Search was cleared');
    this.setState({
        searchText: '',
        clearIconState: false,
        showLoadingSpin: false
    });
};

export class TopSearchBar extends Component {
    constructor(props) {
        super(props);

        this.signal = axios.CancelToken.source();
        this.state = {
            isLoading: false,
            clearIconState: true,
            searchText: '',
            showLoadingSpin: false
        }
    }

    componentWillUnmount() {
        this.signal.cancel('Api is being canceled');
    }

    getSoundCloudData = async (query) => {
        try {
            this.setState({ showLoadingSpin: true });
            const data = await getSoundCloudTacks(this.signal.token, query);
            return Promise.resolve(data);
        }
        catch (err) {
            if (axios.isCancel(err)) {
                console.log('Error: ', err.message); // => prints: Api is being canceled
            } else {
                this.setState({ showLoadingSpin: false });
            };
        }
    }

    render() {
        const {
            clearIconState,
            searchText,
            showLoadingSpin
        } = this.state;

        const {
            actionOnPressSearch
        } = this.props;

        return (
            <SearchBar
                containerStyle={{
                    width: width - MARGIN_RIGHT, padding: 0, backgroundColor: '#fff',
                    borderRadius: 25,
                    borderColor: '#eee',
                    borderWidth: 2,
                }}
                inputContainerStyle={{
                    borderRadius: 25,
                    backgroundColor: '#fff',
                    height: 35
                }}
                lightTheme={true}
                clearIcon={clearIconState}
                placeholder="Search song..."
                onChangeText={updateSearch.bind(this)}
                value={searchText}
                onClear={clearSearch.bind(this)}
                showLoading={showLoadingSpin}
                onCancel={() => this.setState({ showLoadingSpin: false })}
                onEndEditing={() => {
                    const searchText = this.state.searchText;

                    if (!!searchText) {
                        this.getSoundCloudData(searchText)
                            .then(data => {
                                const tracks = filterCleanData(data);
                                this.setState({
                                    clearIconState: true,
                                    showLoadingSpin: false,
                                    searchText: ''
                                });
                                return actionOnPressSearch(tracks);
                            });
                    }
                }}
            />
        )
    }
}