import React, { Component } from 'react';
import io from 'socket.io-client';
//import TrackPlayer from 'react-native-track-player';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    YellowBox
} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { TrackItem } from './TrackItem';
import { SearchBar, ListItem, ButtonGroup, Icon } from 'react-native-elements';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { MainContainer } from '../common/MainContainer';
import { HeaderContainer } from '../common/HeaderContainer';
import { BurgerMenuIcon } from '../common/BurgerMenuIcon';
import { TopSearchBar } from '../common/TopSearchBar';
import { BodyContainer } from '../common/BodyContainer';
import { PlayerContainer } from '../common/PlayerContainer';
import { SongInfoContainer } from '../common/SongInfoContainer';
import { PlayerControlsContainer } from '../common/PlayerControlsContainer';
import { TracksListContainer } from '../common/TracksListContainer';
import { SongInfoALbum } from '../common/SongInfoALbum';
import { SongInfoTitle } from '../common/SongInfoTitle';
import { SongInfoArtist } from '../common/SongInfoArtist';
import { SongInfoTime } from '../common/SongInfoTime';
import { PlayerControlShuffle } from '../common/PlayerControlShuffle';
import { PlayerControlBackward } from '../common/PlayerControlBackward';
import { PlayerControlPlayPause } from '../common/PlayerControlPlayPause';
import { PlayerControlForward } from '../common/PlayerControlForward';
import { PlayerControlRepeat } from '../common/PlayerControlRepeat';
import { TrackListItems } from '../common/TrackListItems';
import { TrackListItem } from '../common/TrackListItem';
import { clearStorage, setStorage } from '../../src/js/Utils/User/session';

let renderCalled = 0;

const LIST_TRACKS = [
    {
        name: 'Track1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Track2',
        artists: [
            {
                name: 'Artist2'
            }
        ]
    },
    {
        name: 'Track3',
        artists: [
            {
                name: 'Artist3'
            }
        ]
    },
    {
        name: 'Track4',
        artists: [
            {
                name: 'Artist4'
            }
        ]
    },
    {
        name: 'Track5',
        artists: [
            {
                name: 'Artist5'
            }
        ]
    },
    {
        name: 'Track1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Track2',
        artists: [
            {
                name: 'Artist2'
            }
        ]
    },
    {
        name: 'Track3',
        artists: [
            {
                name: 'Artist3'
            }
        ]
    },
    {
        name: 'Track4',
        artists: [
            {
                name: 'Artist4'
            }
        ]
    },
    {
        name: 'Track5',
        artists: [
            {
                name: 'Artist5'
            }
        ]
    },
    {
        name: 'Track1',
        artists: [
            {
                name: 'Artist1'
            }
        ]
    },
    {
        name: 'Track2',
        artists: [
            {
                name: 'Artist2'
            }
        ]
    },
    {
        name: 'Track3',
        artists: [
            {
                name: 'Artist3'
            }
        ]
    },
    {
        name: 'Track4',
        artists: [
            {
                name: 'Artist4'
            }
        ]
    },
    {
        name: 'Track5',
        artists: [
            {
                name: 'Artist5'
            }
        ]
    }
]

// check local storage
// if token exists then set state with token
// else set token to null

// debugger;
// const headers = { "Authorization": "Bearer " + data.access_token };
//     fetch('https://api.spotify.com/v1/search?q=calladita&type=track,playlist&limit=10', {
//       headers
//     })
//       .then(resp => {
//         debugger;
//         return resp.json();
//       })
//       .then(data => {
//         debugger;
//       });


export class P2PLanding extends Component {
    constructor(props) {
        super(props);

        // this.socket = io('http://192.168.10.12:3000', {
        //     transports: ['websocket'],
        //     jsonp: false,
        //     reconnectionAttempts: "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
        //     timeout: 10000, //before connect_error and connect_timeout are emitted.
        //     "force new connection": true
        // });

        this.state = {
            isConnected: false,
            searchedTracksList: [],
            search: '',
            isVotedSong: 0,
            isPremiumSong: null,
            hasError: false,
            showLoadingSpin: false,
            songName: 'Waiting...',
            artistName: '',
            listTracks: LIST_TRACKS,
            clearIconState: true,
            text: [],
            showListTracks: 0,
            showListSearchedTracks: 1,
            isSearchingTracks: false
        }
    }

    // static getDerivedStateFromError(error) {
    //     // Update state so the next render will show the fallback UI.
    //     return { hasError: true };
    // }

    // componentDidCatch(error, info) {
    //     // You can also log the error to an error reporting service (Elastic search maybe)
    //     //logErrorToMyService(error, info);
    // }

    // updateSearch = search => {
    //     this.setState({ search });
    // };

    // messageFromServer = (songName, artistName) => {
    //     console.log('messageFromServer() sent to all sockets', songName, artistName);
    //     this.setState({
    //         listTracks: [...this.state.listTracks, {
    //             song: songName,
    //             artist: artistName
    //         }]
    //     });
    // }

    componentWillUnmount() {
        // Cancel all subscriptions in order to prevent memory leaks
        this.socket = null;
    }

    componentDidMount() {
        // this.socket.on('server-send-message', this.messageFromServer.bind(this));
        // this.socket.on('connect', function () {
        //     this.setState({ isConnected: true });
        // }.bind(this));
    }

    // clickme = (songName, artistName) => {
    //     this.socket.emit('send-message', songName, artistName);

    // }

    // pressedItem(songName, artistName) {
    //     return new Promise(resolve => {
    //         console.log('Item pressed:', songName, 'Item Artist:', artistName);

    //         // this.setState({
    //         //     listTracks: [...this.state.listTracks, {
    //         //         song: songName,
    //         //         artist: artistName
    //         //     }]
    //         // });

    //         console.log('List Tracks:', this.state.listTracks),
    //             this.setState({
    //                 songName,
    //                 searchedTracks: []
    //             });

    //         this.clearSearchbar();
    //         this.setState({
    //             text: songName
    //         });

    //         resolve(songName, artistName);
    //     });
    // }

    // clearSearchbar() {
    //     console.log('This was cleared');
    //     this.setState({
    //         searchedTracks: [],
    //         search: '',
    //         clearIconState: false
    //     });
    // }

    handlingOnPressSearch = (searchedTracks) => {
        console.log('Searching....', this.state.searchedTracksList);

        this.setState({
            searchedTracksList: searchedTracks,
            isSearchingTracks: true
        })
    }

    getArtists = artists => {
        artists.map(artist => {
            return Object.values(artist).toString();
        }).toString()
    }

    dispatchActionsSearchedTrack = ({ artists, name }) => {
        console.log('Track Pressed from Search Results', artists, name);
        this.setState({
            searchedTracksList: [],
            isSearchingTracks: false,
            listTracks: [...this.state.listTracks, {
                name: name,
                artists: artists && this.getArtists(artists)
            }]
        });
    }

    handlingTrackItemPressed = (isSearchingTracks, track) => {
        if (isSearchingTracks) {
            this.dispatchActionsSearchedTrack(track)
        } else {
            // dispatchActionsPressedTrack()
        }
    }

    render() {
        console.log('Called render()', renderCalled++)
        const {
            search,
            showLoadingSpin,
            songName,
            listTracks,
            searchedTracksList,
            clearIconState,
            isSearchingTracks
        } = this.state;
        const {
            token,
            refreshToken,
            spotifyApi
        } = this.props;

        console.log('Searched finished', listTracks);

        return (
            <ErrorBoundary>
                <MainContainer>
                    <HeaderContainer>
                        <BurgerMenuIcon />
                        <TopSearchBar actionOnPressSearch={this.handlingOnPressSearch.bind(this)} />
                    </HeaderContainer>
                    <BodyContainer>
                        <PlayerContainer>
                            <SongInfoContainer>
                                <SongInfoALbum songAlbum={"The Hunting Party"} />
                                <SongInfoTitle songTitle={"Final Masquerade"} />
                                <SongInfoArtist songArtist={"Linkin Park"} />
                                <SongInfoTime songTime={"4:52"} />
                            </SongInfoContainer>
                            <PlayerControlsContainer>
                                <PlayerControlShuffle />
                                <PlayerControlBackward />
                                <PlayerControlPlayPause />
                                <PlayerControlForward />
                                <PlayerControlRepeat />
                            </PlayerControlsContainer>
                        </PlayerContainer>
                        <TracksListContainer>
                            <TrackListItems data={isSearchingTracks ? searchedTracksList : listTracks} actionOnPressItem={this.handlingTrackItemPressed.bind(this, isSearchingTracks)}>
                                <TrackListItem />
                            </TrackListItems>
                        </TracksListContainer>
                    </BodyContainer>
                </MainContainer>
            </ErrorBoundary>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
});