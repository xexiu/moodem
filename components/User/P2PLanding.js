import io from 'socket.io-client';
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
import Toast from 'react-native-easy-toast';

let renderCalled = 0;

function setLastTrackFromList(track) {
    track.index = this.state.tracksList.length;
}

export class P2PLanding extends Component {
    constructor(props) {
        super(props);

        this.playerRef = React.createRef();
        this.toastRef = React.createRef();
        this.socket = io('http://138.68.239.239:3000', { // Mobile --> http://172.20.10.9:3000
            transports: ['websocket'],
            jsonp: false,
            reconnectionAttempts: "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            timeout: 10000, //before connect_error and connect_timeout are emitted.
            "force new connection": true
        });
        this.state = {
            searchedTracksList: [],
            tracksList: [],
            isSearchingTracks: false
        }
    }

    componentDidMount() {
        this.socket.on('server-send-message', this.messageFromServer.bind(this));
    }



    componentWillUnmount() {
        // Cancel all subscriptions in order to prevent memory leaks
        this.socket = null;
        this.handlingOnPressSearch = null;
        this.handlingTrackPressed = null;
    }

    messageFromServer = (track) => {
        this.setState({
            tracksList: [...this.state.tracksList, track]
        });
    }

    sendSocketMsg = (track) => {
        this.socket.emit('send-message', track);

    }

    sendSongToTrackList = (track) => {
        this.setState({
            searchedTracksList: [],
            isSearchingTracks: false
        });

        setLastTrackFromList.call(this, track);

        this.sendSocketMsg(track);
    }

    handlingOnPressSearch = (searchedTracks) => {
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
            tracks = isSearchingTracks ? searchedTracksList : tracksList,
        } = this.state

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
                            />
                        </TracksListContainer>
                    </BodyContainer>
                </MainContainer>
            </ErrorBoundary>
        );
    }
}