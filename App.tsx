import NetInfo from '@react-native-community/netinfo';
import React, { PureComponent } from 'react';
import { LogBox } from 'react-native';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OfflineNotice } from './components/common/OfflineNotice';
import { AppContextProvider } from './components/User/functional-components/AppContext';
import Moodem from './Moodem';

const controller = new AbortController();
LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Constants.manifest is null because the embedded app.config could not be read.'
]);

interface App {
    netinfoUnsubscribe: any;
    handleConnectivityChange: (param: any) => void;
    hasInternetConnection: boolean;
}

interface State {
    hasInternetConnection: boolean;
}

class App extends PureComponent<App, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            hasInternetConnection: true
        };
    }

    handleConnectivityChange = (connection: any) => {
        this.setState({
            hasInternetConnection: connection.isConnected
        });
    };

    componentDidMount() {
        this.netinfoUnsubscribe = NetInfo.addEventListener(this.handleConnectivityChange);
    }

    componentWillUnmount() {
        controller.abort();
        if (this.netinfoUnsubscribe) {
            this.netinfoUnsubscribe();
            this.netinfoUnsubscribe = null;
        }
    }

    render() {
        const {
            hasInternetConnection
        } = this.state;

        if (!hasInternetConnection) {
            return (
                (<OfflineNotice />)
            );
        }

        return (
            <ErrorBoundary>
                <AppContextProvider>
                    <Moodem />
                </AppContextProvider>
            </ErrorBoundary>
        );
    }
}

export default App;
