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
    getStorage = null;

    this.state = {
      accessToken: null,
      tokenType: null,
      showLoader: true,
      hasInternetConnection: true,
      hasError: false
    }
  }

  handleConnectivityChange = (state) => {
    return state.isConnected && this.setState({ hasInternetConnection: true });
  }

  updateState(data) {
    this.setState({
      accessToken: data.access_token,
      tokenType: data.token_type,
      showLoader: false
    });
  }

  resetState() {
    this.setState({
      accessToken: null,
      tokenType: null,
      hasLoaded: false
    });
  }

  componentWillUnmount() {
    this.netInfo = null;
    this.getStorage = null;
  }

  async componentDidMount() {
    this.netInfo = NetInfo.fetch()
      .then(this.handleConnectivityChange)
      .catch(() => { });

    this.initAccessToken();

    this.getStorage = getFromStorage('spotifyAuth')
      .then((session) => {
        if (session) {
          const obj = JSON.parse(session);
          this.updateState(obj);
        } else {
          this.resetState();
        }
      })
      .catch(this.resetState());
  }

  initAccessToken = () => {
    spotifyApi.fetchAccessToken('/api/token', data => {

      setStorage('spotifyAuth', {
        access_token: data.access_token,
        token_type: data.token_type
      });

      this.updateState(data)
      spotifyApi.setAccessToken(data.access_token);
      spotifyApi.setTokenType(data.token_type);
    })
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