/* eslint-disable max-len */
import io from 'socket.io-client';
import Toast from 'react-native-easy-toast';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { MainContainer } from '../common/MainContainer';
import { HeaderContainer } from '../common/HeaderContainer';
import { BurgerMenuIcon } from '../common/BurgerMenuIcon';
import { CommonTopSearchBar } from '../common/functional-components/CommonTopSearchBar';
import { CommonFlatList } from '../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../common/functional-components/CommonFlatListItem';
import { SongsListEmpty } from '../../screens/User/functional-components/SongsListEmpty';
import { getSoundCloudData } from '../../src/js/SoundCloud/soundCloudFetchers';
import { filterCleanData } from '../../src/js/Utils/Helpers/actions/songs';
import { BodyContainer } from '../common/BodyContainer';
import { PlayerContainer } from '../common/PlayerContainer';
import { Player } from '../common/Player';
import { TracksListContainer } from '../common/TracksListContainer';
import { TrackListItems } from '../common/TrackListItems';
import { Icon } from 'react-native-elements';
import { View, Text, TouchableHighlight, Button } from 'react-native';
import { UserContext } from '../User/functional-components/UserContext';

const welcomeMsgMoodem = (toastRef) => data => toastRef.show(data, 1000);
const messageFromServerWithTrack = (setTracksList) => tracksList => setTracksList([...tracksList]);

const checkSearchedTrackIfAlreadyOnTrackList = (tracksList, searchedTracks) => {
    tracksList.forEach(track => {
        searchedTracks.forEach(searchedTrack => {
            if (track.id === searchedTrack.id) {
                Object.assign(searchedTrack, {
                    isOnTracksList: true
                });
            }
        });
    });
};


const P2PLanding = (props) => {
    const { navigation } = props;
    const { user } = useContext(UserContext);
    const [searchedTracksList = [], setSearchedTracksList] = useState([]);
    const [tracksList = [], setTracksList] = useState([]);
    const [isSearchingTracks = false, setIsSearchingTracks] = useState(false);
    const signal = axios.CancelToken.source();
    const tracks = isSearchingTracks ? searchedTracksList : tracksList;
    const socket = io('http://192.168.10.12:3000', { // Mobile --> http://172.20.10.9:3000
        transports: ['websocket'],
        jsonp: false,
        reconnectionAttempts: 'Infinity', //avoid having user reconnect manually in order to prevent dead clients after a server restart
        timeout: 10000, //before connect_error and connect_timeout are emitted.
        'force new connection': true
    });
    const playerRef = React.createRef();
    const toastRef = React.createRef();


    useEffect(() => {
        console.log('Effect');
        socket.on('server-send-message-PlayListMoodem', welcomeMsgMoodem(toastRef.current));
        socket.on('server-send-message-track', messageFromServerWithTrack(setTracksList));
        // socket.on('server-send-message-vote', this.messageFromServerWithVote.bind(this));
        // socket.on('server-send-message-boost', this.messageFromServerWithBoost.bind(this));
        socket.emit('join-global-playList-moodem', { chatRoom: 'global-playList-moodem', displayName: user.displayName || 'Guest' });
        socket.emit('send-message-track');

        return () => {
            socket.off(welcomeMsgMoodem);
            socket.off(messageFromServerWithTrack);
            // socket.off(this.messageFromServerWithVote);
            // socket.off(this.messageFromServerWithBoost);
            socket.close();
        };
    }, [tracksList.length]);

    const handlingOnPressSearch = (searchedTracks) => {
        checkSearchedTrackIfAlreadyOnTrackList(tracksList, searchedTracks);
        setSearchedTracksList(searchedTracks);
        setIsSearchingTracks(!!searchedTracks.length);
    };

    const onEndEditingSearch = (text) => new Promise(resolve => {
        getSoundCloudData(text, signal)
            .then(data => {
                handlingOnPressSearch(filterCleanData(data, user));
                return resolve();
            })
            .catch(err => {
                console.log('Error', err);
            });
    });

    const sendSongToTrackList = (track) => {
        setSearchedTracksList([]);
        setIsSearchingTracks(false);

        Object.assign(track, {
            isOnTracksList: true,
            index: tracksList.length
        });

        socket.emit('send-message-track', track);
    };

    const renderItem = (song) => (
        <CommonFlatListItem
            bottomDivider
            title={song.title}
            chevron={isSearchingTracks && !song.isOnTracksList && {
                color: '#dd0031',
                onPress: () => sendSongToTrackList(song),
                size: 10,
                raised: true,
                iconStyle: { fontSize: 15, paddingLeft: 2 },
                containerStyle: { marginRight: -10 }
            }}
            checkmark={isSearchingTracks && song.isOnTracksList}
            action={() => console.log('Pressed', song)}
        />
    );

    console.log('Tracks', tracks);


    return (
        <ErrorBoundary>
            <MainContainer>
                <HeaderContainer>
                    <BurgerMenuIcon action={() => navigation.openDrawer()} />
                    <CommonTopSearchBar placeholder="Search song..." onEndEditingSearch={onEndEditingSearch} />
                </HeaderContainer>

                <PlayerContainer>
                    <Player ref={playerRef} tracks={tracks} />
                    <Toast
                        position='top'
                        ref={toastRef}
                    />
                </PlayerContainer>


                <TracksListContainer>

                    <CommonFlatList
                        emptyListComponent={SongsListEmpty}
                        data={tracks}
                        action={({ item }) => renderItem(item)}
                    />

                    {/* <TrackListItems
                        isSearchingTracks={isSearchingTracks}
                        data={tracks}

                    /> */}
                </TracksListContainer>


            </MainContainer>
            <Toast
                position='top'
                ref={toastRef}
            />
        </ErrorBoundary>
    );
};

P2PLanding.navigationOptions = ({ route }) => ({
    headerShown: false,
    title: route.params.groupName
});

export {
    P2PLanding
};

// const renderCalled = 0;

// function setLastTrackFromList(track) {
//     track.index = this.state.tracksList.length;
// }

// function getDrawerIcon(name, type = 'font-awesome', size, style, color, action = () => { }) {
//     return (<Icon
//         name={name}
//         type={type}
//         size={size}
//         style={style}
//         color={color}
//         onPress={action}
//     />);
// }

// export class P2PLanding extends Component {
//     static navigationOptions = ({ route }) => ({
//         headerShown: false,
//         title: route.params.groupName
//     });

//     constructor(props) {
//         super(props);

//         this.playerRef = React.createRef();
//         this.toastRef = React.createRef();
//         this.socket = io('http://192.168.10.12:3000', { // Mobile --> http://172.20.10.9:3000
//             transports: ['websocket'],
//             jsonp: false,
//             reconnectionAttempts: 'Infinity', //avoid having user reconnect manually in order to prevent dead clients after a server restart
//             timeout: 10000, //before connect_error and connect_timeout are emitted.
//             'force new connection': true
//         });
//         this.state = {
//             searchedTracksList: [],
//             tracksList: [],
//             isSearchingTracks: false,
//             welcomeGuestText: ''
//         };
//     }

//     componentDidMount() {
//         this.socket.on('server-send-message-PlayListMoodem', this.messageFromServerPLayListMoodem.bind(this));
//         this.socket.on('server-send-message-track', this.messageFromServerWithTrack.bind(this));
//         this.socket.on('server-send-message-vote', this.messageFromServerWithVote.bind(this));
//         this.socket.on('server-send-message-boost', this.messageFromServerWithBoost.bind(this));
//         this.socket.emit('send-message-track');
//         this.socket.emit('join-global-playList-moodem', { chatRoom: 'global-playList-moodem' });
//     }

//     componentWillUnmount() {
//         // Cancel all subscriptions in order to prevent memory leaks
//         this.handlingOnPressSearch = null;
//         this.handlingTrackPressed = null;
//         this.socket.off(this.messageFromServerWithTrack);
//         this.socket.off(this.messageFromServerWithVote);
//         this.socket.off(this.messageFromServerWithBoost);
//         this.socket.close();
//     }

//     messageFromServerPLayListMoodem = (data) => {
//         console.log('Data from server', data);
//         this.setState({
//             welcomeGuestText: data
//         });
//     }

//     messageFromServerWithBoost = (tracksList) => {
//         this.setState({
//             tracksList
//         });
//     }

//     messageFromServerWithVote = (tracksList) => {
//         this.setState({
//             tracksList
//         });
//     }

//     messageFromServerWithTrack = (tracksList) => {
//         tracksList.forEach(track => {
//             this.setState({
//                 userVoted: track.hasVoted,
//                 userId: track.user.user_id
//             });
//         });
//         this.setState({
//             tracksList
//         });
//     }

//     sendSocketMsgWithTrack = (track) => {
//         this.socket.emit('send-message-track', track);
//     }

//     sendSocketMsgWithVote = (trackId, voteCount) => {
//         this.socket.emit('send-message-vote', trackId, voteCount);
//     }

//     sendSocketMsgWithBoost = (trackId, boostCount) => {
//         this.socket.emit('send-message-boost', trackId, boostCount);
//     }

//     sendSongToTrackList = (track) => {
//         this.setState({
//             searchedTracksList: [],
//             isSearchingTracks: false
//         });

//         track.isOnTracksList = true;

//         setLastTrackFromList.call(this, track);

//         this.sendSocketMsgWithTrack(track);
//     }

//     sendVoteToTrackList = (trackId, voteCount) => {
//         this.sendSocketMsgWithVote(trackId, voteCount);
//     }

//     sendBoostToTrackList = (trackId, boostCount) => {
//         this.sendSocketMsgWithBoost(trackId, boostCount);
//     }

//     checkSearchedTrackIfAlreadyOnTrackList = (searchedTracks) => {
//         this.state.tracksList.forEach(tracksList => {
//             searchedTracks.forEach(searchedTrack => {
//                 if (tracksList.id === searchedTrack.id) {
//                     searchedTrack.isOnTracksList = true;
//                 }
//             });
//         });
//     }

//     handlingOnPressSearch = (searchedTracks) => {
//         this.checkSearchedTrackIfAlreadyOnTrackList(searchedTracks);
//         this.setState({
//             searchedTracksList: searchedTracks,
//             isSearchingTracks: !!searchedTracks.length
//         });
//     }

//     handlingTrackPressed = (isSearchingTracks, track) => {
//         this.playerRef.current.handlingTrackedPressed(isSearchingTracks, track);
//     }

//     render() {
//         //console.log('Called render P2PLanding GROUP()', this.props.route.params.group);
//         //console.log('Called render P2PLanding USER()', this.props.route.params.user);

//         const {
//             tracksList,
//             searchedTracksList,
//             isSearchingTracks,
//             tracks = isSearchingTracks ? searchedTracksList : tracksList,
//             welcomeGuestText
//         } = this.state;

//         return (

//             <ErrorBoundary>
//                 <MainContainer>
//                     <HeaderContainer>
//                         <BurgerMenuIcon action={() => this.props.navigation.openDrawer()} />
//                         <TopSearchBar fillTracksList={this.handlingOnPressSearch.bind(this)} />
//                     </HeaderContainer>
//                     <BodyContainer>
//                         <Text>Hello: {welcomeGuestText}</Text>
//                         <PlayerContainer>
//                             <Player ref={this.playerRef} tracks={tracks} />
//                             <Toast
//                                 position='top'
//                                 ref={this.toastRef}
//                             />
//                         </PlayerContainer>
//                         <TracksListContainer>
//                             <TrackListItems
//                                 isSearchingTracks={isSearchingTracks}
//                                 data={tracks}
//                                 // eslint-disable-next-line max-len
//                                 trackPressed={this.handlingTrackPressed.bind(this, isSearchingTracks)}
//                                 sendSongToTrackList={this.sendSongToTrackList.bind(this)}
//                                 sendVoteToTrackList={this.sendVoteToTrackList.bind(this)}
//                                 sendBoostToTrackList={this.sendBoostToTrackList.bind(this)}
//                             />
//                         </TracksListContainer>
//                     </BodyContainer>
//                 </MainContainer>
//             </ErrorBoundary>
//         );
//     }
// }
