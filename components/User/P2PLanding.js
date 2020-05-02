import io from 'socket.io-client';
import Toast from 'react-native-easy-toast';
import React, { useContext, useEffect, useState } from 'react';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { MainContainer } from '../common/MainContainer';
import { HeaderContainer } from '../common/HeaderContainer';
import { BurgerMenuIcon } from '../common/BurgerMenuIcon';
import { TopSearchBar } from '../common/TopSearchBar';
import { BodyContainer } from '../common/BodyContainer';
import { PlayerContainer } from '../common/PlayerContainer';
import { Player } from '../common/Player';
import { TracksListContainer } from '../common/TracksListContainer';
import { TrackListItems } from '../common/TrackListItems';
import { Icon } from 'react-native-elements';
import { View, Text, TouchableHighlight, Button } from 'react-native';
import { UserContext } from '../User/functional-components/UserContext';


export const P2PLanding = (props) => {
    const { user } = useContext(UserContext);
    const [welsomeMsg, setWelcomeMsg] = useState('');

    useEffect(() => {
        const socket = io('http://192.168.10.12:3000', { // Mobile --> http://172.20.10.9:3000
            transports: ['websocket'],
            jsonp: false,
            reconnectionAttempts: 'Infinity', //avoid having user reconnect manually in order to prevent dead clients after a server restart
            timeout: 10000, //before connect_error and connect_timeout are emitted.
            'force new connection': true
        });

        socket.on('server-send-message-PlayListMoodem', data => {
            console.log('Data from server', data);
            setWelcomeMsg(data.user);
        });
        socket.emit('join-global-playList-moodem', { chatRoom: 'global-playList-moodem', user: user || 'Guest' });
        return () => {

        };
    });

    return (
        <View style={{ marginTop: 40 }}>
            <Text>Hello:</Text>
        </View>
    );
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
