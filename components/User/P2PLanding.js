import io from 'socket.io-client';
import Toast from 'react-native-easy-toast';
import React, { Component } from 'react';
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

let renderCalled = 0;

function setLastTrackFromList(track) {
    track.index = this.state.tracksList.length;
}

export class P2PLanding extends Component {
    constructor(props) {
        super(props);

        this.playerRef = React.createRef();
        this.toastRef = React.createRef();
        this.socket = io('http://192.168.10.12:3000', { // Mobile --> http://172.20.10.9:3000
            transports: ['websocket'],
            jsonp: false,
            reconnectionAttempts: "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            timeout: 10000, //before connect_error and connect_timeout are emitted.
            "force new connection": true
        });
        //this.socket.emit('join-global-chat-room', { chatRoom: 'global-chat-room' })
        this.state = {
            searchedTracksList: [],
            tracksList: [],
            isSearchingTracks: false
        }
    }

    componentDidMount() {
        this.socket.on('server-send-message-track', this.messageFromServerWithTrack.bind(this));
        this.socket.on('server-send-message-vote', this.messageFromServerWithVote.bind(this));
        this.socket.on('server-send-message-boost', this.messageFromServerWithBoost.bind(this));
        this.socket.emit("send-message-track");
    }

    componentWillUnmount() {
        // Cancel all subscriptions in order to prevent memory leaks
        this.handlingOnPressSearch = null;
        this.handlingTrackPressed = null;
        this.socket.off(this.messageFromServerWithTrack);
        this.socket.off(this.messageFromServerWithVote);
        this.socket.off(this.messageFromServerWithBoost);
        this.socket.close();
    }

    messageFromServerWithBoost = (tracksList) => {
        this.setState({
            tracksList: tracksList
        });
    }

    messageFromServerWithVote = (tracksList) => {
        this.setState({
            tracksList
        });
    }

    messageFromServerWithTrack = (tracksList) => {
        tracksList.forEach(track => {
            this.setState({
                userVoted: track.hasVoted,
                userId: track.user.user_id
            })
        })
        this.setState({
            tracksList
        });
    }

    sendSocketMsgWithTrack = (track) => {
        this.socket.emit('send-message-track', track);
    }

    sendSocketMsgWithVote = (trackId, voteCount) => {
        this.socket.emit('send-message-vote', trackId, voteCount);
    }

    sendSocketMsgWithBoost = (trackId, boostCount) => {
        this.socket.emit('send-message-boost', trackId, boostCount);
    }

    sendSongToTrackList = (track) => {
        this.setState({
            searchedTracksList: [],
            isSearchingTracks: false
        });

        track.isOnTracksList = true;

        setLastTrackFromList.call(this, track);

        this.sendSocketMsgWithTrack(track);
    }

    sendVoteToTrackList = (trackId, voteCount) => {
        this.sendSocketMsgWithVote(trackId, voteCount);
    }

    sendBoostToTrackList = (trackId, boostCount) => {
        this.sendSocketMsgWithBoost(trackId, boostCount);
    }

    checkSearchedTrackIfAlreadyOnTrackList = (searchedTracks) => {
        this.state.tracksList.forEach(tracksList => {
            searchedTracks.forEach(searchedTrack => {
                if (tracksList.id === searchedTrack.id) {
                    searchedTrack.isOnTracksList = true;
                }
            })
        })
    }

    handlingOnPressSearch = (searchedTracks) => {
        this.checkSearchedTrackIfAlreadyOnTrackList(searchedTracks);
        this.setState({
            searchedTracksList: searchedTracks,
            isSearchingTracks: !!searchedTracks.length
        });
    }

    handlingTrackPressed = (isSearchingTracks, track) => {
        this.playerRef.current.handlingTrackedPressed(isSearchingTracks, track);
    }

    render() {
        console.log('Called render P2PLanding()', renderCalled++)
        const {
            tracksList,
            searchedTracksList,
            isSearchingTracks,
            tracks = isSearchingTracks ? searchedTracksList : tracksList
        } = this.state;

        console.log('Tracks', tracks);

        return (
            <ErrorBoundary>
                <MainContainer>
                    <HeaderContainer>
                        <BurgerMenuIcon />
                        <TopSearchBar fillTracksList={this.handlingOnPressSearch.bind(this)} />
                    </HeaderContainer>
                    <BodyContainer>
                        <PlayerContainer>
                            <Player ref={this.playerRef} tracks={tracks} />
                            <Toast
                                position='top'
                                ref={this.toastRef}
                            />
                        </PlayerContainer>
                        <TracksListContainer>
                            <TrackListItems
                                isSearchingTracks={isSearchingTracks}
                                data={tracks}
                                trackPressed={this.handlingTrackPressed.bind(this, isSearchingTracks)}
                                sendSongToTrackList={this.sendSongToTrackList.bind(this)}
                                sendVoteToTrackList={this.sendVoteToTrackList.bind(this)}
                                sendBoostToTrackList={this.sendBoostToTrackList.bind(this)}
                            />
                        </TracksListContainer>
                    </BodyContainer>
                </MainContainer>
            </ErrorBoundary>
        );
    }
}