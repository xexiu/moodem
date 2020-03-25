import { AppLoading } from 'expo';
import React, { Component } from 'react';
import { PreLoader } from './components/common/PreLoader';
import { Login } from './components/Guest/Login';
import { P2PLanding } from './components/User/P2PLanding';
import { AsyncStorage } from 'react-native';

let calls = 0;

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: null,
      tokenType: null,
      refreshToken: null,
      showLoader: true
    }
  }

  updateState(data) {
    console.log('updateState(), App.js', calls++);
    this.setState({
      accessToken: data.access_token,
      tokenType: data.token_type,
      refreshToken: data.refresh_token,
      showLoader: false
    });
  }

  resetState() {
    console.log('resetState(), App.js', calls++);
    this.setState({
      accessToken: null,
      tokenType: null,
      refreshToken: null,
      hasLoaded: false
    });
  }

  async componentDidMount() {
    console.log('componentDidMount(), App.js', calls++);
    AsyncStorage.getItem('spotifyAuth')
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
    console.log('render(), App.js', calls++);
    const {
      accessToken,
      showLoader
    } = this.state;

    if (showLoader) {
      return (<PreLoader updateLoader={loaderState => this.setState({ showLoader: loaderState })} />);
    } else if (accessToken) {
      AsyncStorage.clear().then(() => console.log('Cleared'));
      return (<P2PLanding token={this.state.accessToken}/>);
    }

    return (<Login updateState={this.updateState.bind(this)} />);
  }
}

export default App;