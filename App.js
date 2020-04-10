import React, { Component } from 'react';
import NetInfo from '@react-native-community/netinfo';
import SpotifyAPI from './src/js/Utils/Spotify/SpotifyAPI';
import { PreLoader } from './components/common/PreLoader';
import { OfflineNotice } from './components/common/OfflineNotice'
import { Login } from './components/Guest/Login';
import { P2PLanding } from './components/User/P2PLanding';
import { clearStorage, getFromStorage, setStorage } from './src/js/Utils/User/session';

const spotifyApi = new SpotifyAPI({
  clientId: 'fe1b8e46e4f048009d55382540d3fa5f',
  clientSecret: '5a6d65bb87f840ac963a30f448b314df'
});

export class App extends Component {
  constructor(props) {
    super(props);
    netInfo = null;

    this.state = {
      showLoader: true,
      hasInternetConnection: true,
      hasError: false
    }
  }

  handleConnectivityChange = (state) => {
    return state.isConnected && this.setState({ hasInternetConnection: true });
  }

  componentWillUnmount() {
    this.netInfo = null;
  }

  componentDidMount() {
  }



  render() {
    console.log('Called render(), from App Component')
    const {
      accessToken,
      showLoader,
      hasInternetConnection
    } = this.state;

    // if (!hasInternetConnection) {
    //   return (<OfflineNotice />);
    // } else if (showLoader) {
    //   return (<PreLoader updateLoader={loaderState => this.setState({ showLoader: loaderState })} />);
    // } else if (accessToken) {
    //   //clearStorage();
    // }
    return (<P2PLanding spotifyApi={spotifyApi} token={accessToken} spotifyApi={spotifyApi} />);

    //return (<Login spotifyApi={spotifyApi} updateState={this.updateState.bind(this)} />);
  }
}

export default App;