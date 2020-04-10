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

let renderCalled = 0;

export class P2PLanding extends Component {
    constructor(props) {
        super(props);

        this.playerRef = React.createRef();
        this.socket = io('http://192.168.10.12:3000', { // Mobile --> http://172.20.10.9:3000
            transports: ['websocket'],
            jsonp: false,
            reconnectionAttempts: "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            timeout: 10000, //before connect_error and connect_timeout are emitted.
            "force new connection": true
        });
        this.state = {
            searchedTracksList: [],
            listTracks: [],
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
            listTracks: [...this.state.listTracks, track]
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

        this.playerRef.current.setTracks([...this.state.listTracks, track]);

        this.sendSocketMsg(track);
    }

    handlingOnPressSearch = (searchedTracks) => {
        this.setState({
            searchedTracksList: searchedTracks,
            isSearchingTracks: !!searchedTracks.length
        });
        this.playerRef.current.setTracks(searchedTracks);
    }

    handlingTrackPressed = (isSearchingTracks, track) => {
        this.playerRef.current.handlingTrackedPressed(isSearchingTracks, track);
    }

    render() {
        console.log('Called render P2PLanding()', renderCalled++)
        const {
            listTracks,
            searchedTracksList,
            isSearchingTracks,
            tracks = isSearchingTracks ? searchedTracksList : listTracks,
        } = this.state;

        return (
            <ErrorBoundary>
                <MainContainer>
                    <HeaderContainer>
                        <BurgerMenuIcon />
                        <TopSearchBar fillTracksList={this.handlingOnPressSearch.bind(this)} />
                    </HeaderContainer>
                    <BodyContainer>
                        <PlayerContainer>
                            <Player ref={this.playerRef} />
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