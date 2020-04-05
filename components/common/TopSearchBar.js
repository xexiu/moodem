import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import { Dimensions } from 'react-native';
import { doFetch } from '../../src/js/Utils/ConnectionManager';
import { getFromStorage, setStorage, clearStorage } from '../../src/js/Utils/User/session';

const MARGIN_RIGHT = 80;
const {
    width
} = Dimensions.get('window');

function handleCancelSearchBar() {
    this.setState({
        showLoadingSpin: false
    });
};

function handlePressSeachOnEnd() {
    this.setState({
        showLoadingSpin: !!this.state.searchText,
        clearIconState: true,
        showLoadingSpin: false,
        searchText: ''
    });

}

function updateSearch(searchText) {
    this.setState({
        searchText,
        clearIconState: true
    });
};

function clearSearchbar() {
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

        this.state = {
            clearIconState: true,
            searchText: '',
            showLoadingSpin: false
        }
    }

    render() {
        const {
            clearIconState,
            searchText,
            showLoadingSpin
        } = this.state;

        const {
            actionOnPressSearch,
            token,
            refreshToken,
            spotifyApi
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
                onClear={clearSearchbar.bind(this)}
                showLoading={showLoadingSpin}
                onCancel={handleCancelSearchBar.bind(this)}
                onEndEditing={() => {
                    const searchText = this.state.searchText;

                    if (!!searchText) {
                        this.setState({
                            showLoadingSpin: true
                        });

                        spotifyApi.searchTracks(`/v1/search?q=${searchText}&type=track,playlist&limit=20`, token, repeat = (data) => {
                            const error = data.error;
                            if (error && error.status === 401 && error && error.message === 'The access token expired') {
                                debugger;
                                spotifyApi.getTokenWithRefreshedToken('/api/token', refreshToken, (data) => {
                                    getFromStorage('spotifyAuth').then(session => {
                                        debugger;
                                        const obj = JSON.parse(session);
                                        setStorage('spotifyAuth', {
                                            access_token: data.access_token,
                                            token_type: obj.token_type,
                                            refresh_token: obj.refresh_token
                                        }, spotifyApi.searchTracks(`/v1/search?q=${searchText}&type=track,playlist&limit=20`, data.access_token, repeat));
                                    });
                                })
                            } else {
                                actionOnPressSearch(data.tracks.items);
                                handlePressSeachOnEnd.call(this);
                            }
                        });
                    }
                }}
            />
        )
    }
}