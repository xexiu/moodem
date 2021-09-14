import NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';
import React, { PureComponent } from 'react';
import { LogBox } from 'react-native';
import { ErrorBoundary } from './components/common/class-components/ErrorBoundary';
import BgImage from './components/common/functional-components/BgImage';
import { BodyContainer } from './components/common/functional-components/BodyContainer';
import { MainContainer } from './components/common/functional-components/MainContainer';
import { OfflineNotice } from './components/common/functional-components/OfflineNotice';
import PreLoader from './components/common/functional-components/PreLoader';
import { AppContextProvider } from './components/User/store-context/AppContext';
import Moodem from './Moodem';
import { RNLocalize, setI18nConfig } from './src/js/Utils/Helpers/actions/translationHelpers';
import { sentryInit } from './src/js/Utils/Helpers/services/sentry';

// sentryInit();

const controller = new AbortController();
LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Constants.manifest is null because the embedded app.config could not be read.'
]);

type AppState = {
    hasInternetConnection: boolean;
    isLoading: boolean
};
class App extends PureComponent<{}, AppState> {
    netinfoUnsubscribe: any;

    constructor(props: any) {
        const transaction = Sentry.startTransaction({
            name: 'Main App Component',
            sampled: true
        });
        transaction.sampled = true;
        transaction.finish();
        super(props);
        this.state = {
            hasInternetConnection: true,
            isLoading: true
        };

        setI18nConfig();
    }

    handleConnectivityChange = (connection: any) => {
        this.setState({
            hasInternetConnection: connection.isConnected,
            isLoading: !connection.isConnected
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
        // PushNotification.unregister();
        RNLocalize.removeEventListener('change', this.handleLocalizationChange);
        if (this.netinfoUnsubscribe) {
            this.netinfoUnsubscribe();
            this.netinfoUnsubscribe = null;
        }
    }

    render() {
        const {
            hasInternetConnection,
            isLoading
        } = this.state;

        if (!hasInternetConnection) {
            return (
                (<OfflineNotice />)
            );
        }

        if (isLoading) {
            return (
                <BodyContainer>
                    <BgImage />
                    <PreLoader
                        containerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        size={50}
                    />
                </BodyContainer>
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
