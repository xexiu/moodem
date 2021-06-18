import NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';
import React, { PureComponent } from 'react';
import { LogBox } from 'react-native';
import { ErrorBoundary } from './components/common/class-components/ErrorBoundary';
import { MainContainer } from './components/common/functional-components/MainContainer';
import { OfflineNotice } from './components/common/functional-components/OfflineNotice';
import { AppContextProvider } from './components/User/store-context/AppContext';
import Moodem from './Moodem';
import { sentryInit } from './src/js/Utils/Helpers/services/sentry';

sentryInit();

const controller = new AbortController();
LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Constants.manifest is null because the embedded app.config could not be read.'
]);

type AppProps = {
    netinfoUnsubscribe: any;
    handleConnectivityChange: (param: any) => void;
    hasInternetConnection: boolean;
};

type AppState = {
    hasInternetConnection: boolean;
};

class App extends PureComponent<AppProps, AppState> {
    public netinfoUnsubscribe: any;

    constructor(props: any) {
        const transaction = Sentry.startTransaction({
            name: 'Main App Component',
            sampled: true
        });
        transaction.sampled = true;
        transaction.finish();
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
            <MainContainer>
                <ErrorBoundary>
                    <AppContextProvider>
                        <Moodem />
                    </AppContextProvider>
                </ErrorBoundary>
            </MainContainer>
        );
    }
}

export default App;
