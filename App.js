import React, { Component } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { OfflineNotice } from './components/common/OfflineNotice'
import { P2PLanding } from './components/User/P2PLanding';

export class App extends Component {
  constructor(props) {
    super(props);
    this.netInfo = () => NetInfo.fetch().then(connection => {
      this.handleConnectivityChange(connection);
    });

    this.state = {
      hasInternetConnection: true,
      connectionParams: {
        connectionType: 'wifi',
        connectionDetails: null
      }
    }
  }

  handleConnectivityChange = (connection) => {
    this.setState({
      hasInternetConnection: connection.isConnected,
      connectionParams: {
        connectionType: connection.type,
        connectionDetails: connection.details
      }
    });
  }

  componentWillUnmount() {
    this.netInfo = null;
  }

  componentDidMount() {
    this.netInfo();
  }



  render() {
    console.log('Called render(), from App Component');
    const {
      hasInternetConnection
    } = this.state;

    if (!hasInternetConnection) {
      return (<OfflineNotice />);
    }

    return (<P2PLanding />)
  }
}

export default App;