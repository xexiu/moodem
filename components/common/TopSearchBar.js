import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import { Dimensions } from 'react-native';

const MARGIN_RIGHT = 80;
const {
    width
} = Dimensions.get('window');

const DUMMY_TRACKS = [
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name2',
        artists: [
            {
                name: 'Artist2'
            }
        ]
    },
    {
        name: 'Name3',
        artists: [
            {
                name: 'Artist3'
            }
        ]
    },
    {
        name: 'Name4',
        artists: [
            {
                name: 'Artist4'
            }
        ]
    },
    {
        name: 'Name5',
        artists: [
            {
                name: 'Artist5'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Name1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Last Song Name',
        artists: [
            {
                name: 'Last Artist Name'
            }
        ]
    }
]

function handleCancelSearchBar() {
    this.setState({
        showLoadingSpin: false
    });
};

function handlePressSeachOnEnd() {

    console.log('You Pressed Search, text:', this.state.searchText);
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
                onClear={clearSearchbar.bind(this)}
                showLoading={showLoadingSpin}
                onCancel={handleCancelSearchBar.bind(this)}
                onEndEditing={() => {
                    if (!!this.state.searchText) {
                        // Perform fetch to spotify with searchText
                        actionOnPressSearch(DUMMY_TRACKS)
                    }
                    handlePressSeachOnEnd.call(this);
                }}
            />
        )
    }
}