import NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';
import React, { PureComponent } from 'react';
import { LogBox } from 'react-native';
import { ErrorBoundary } from './components/common/class-components/ErrorBoundary';
import { MainContainer } from './components/common/functional-components/MainContainer';
import { OfflineNotice } from './components/common/functional-components/OfflineNotice';
import { AppContextProvider } from './components/User/store-context/AppContext';
import Moodem from './Moodem';
import { RNLocalize, setI18nConfig } from './src/js/Utils/Helpers/actions/translationHelpers';
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
        setI18nConfig();
    }

    handleConnectivityChange = (connection: any) => {
        this.setState({
            hasInternetConnection: connection.isConnected
        });
    };

    handleLocalizationChange = () => {
        setI18nConfig();
        this.forceUpdate();
    };

    componentDidMount() {
        this.netinfoUnsubscribe = NetInfo.addEventListener(this.handleConnectivityChange);
        RNLocalize.addEventListener('change', this.handleLocalizationChange);
    }

    componentWillUnmount() {
        controller.abort();
        RNLocalize.removeEventListener('change', this.handleLocalizationChange);
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
