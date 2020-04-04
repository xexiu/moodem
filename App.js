import React, { Component } from 'react';
import NetInfo from '@react-native-community/netinfo';
import SpotifyAPI from './src/js/Utils/Spotify/SpotifyAPI';
import { PreLoader } from './components/common/PreLoader';
import { OfflineNotice } from './components/common/OfflineNotice'
import { Login } from './components/Guest/Login';
import { P2PLanding } from './components/User/P2PLanding';
import { clearStorage, getFromStorage } from './src/js/Utils/User/session';

const spotifyApi = new SpotifyAPI({
  clientId: 'fe1b8e46e4f048009d55382540d3fa5f',
  clientSecret: '5a6d65bb87f840ac963a30f448b314df',
  redirectUri: 'https://auth.expo.io/@sergio.m/moodem'
});

export class App extends Component {
  constructor(props) {
    super(props);
    netInfo = null;
    getStorage = null;

    this.state = {
      accessToken: null,
      tokenType: null,
      refreshToken: null,
      showLoader: true,
      hasInternetConnection: true,
      hasError: false
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service (Elastic search maybe)
    //logErrorToMyService(error, info);
  }

  handleConnectivityChange = (state) => {
		return state.isConnected && this.setState({ hasInternetConnection: true });
	}

  updateState(data) {
    this.setState({
      accessToken: data.access_token,
      tokenType: data.token_type,
      refreshToken: data.refresh_token,
      showLoader: false
    });
  }

  resetState() {
    this.setState({
      accessToken: null,
      tokenType: null,
      refreshToken: null,
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
    .catch(() => {})

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


  render() {
    console.log('Called render(), from App Component')
    const {
      accessToken,
      refreshToken,
      showLoader,
      hasInternetConnection
    } = this.state;

    if (!hasInternetConnection) {
      return (<OfflineNotice />);
    } else if (showLoader) {
      return (<PreLoader updateLoader={loaderState => this.setState({ showLoader: loaderState })} />);
    } else if (accessToken) {
      //clearStorage();
      return (<P2PLanding spotifyApi={spotifyApi} token={accessToken} refreshToken={refreshToken} />);
    }

    return (<Login spotifyApi={spotifyApi} updateState={this.updateState.bind(this)} />);
  }
}

export default App;