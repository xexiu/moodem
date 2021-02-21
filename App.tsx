import NetInfo from '@react-native-community/netinfo';
import React, { memo, useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { BgImage } from './components/common/functional-components/BgImage';
import { PreLoader } from './components/common/functional-components/PreLoader';
import { OfflineNotice } from './components/common/OfflineNotice';
import { AppContextProvider } from './components/User/functional-components/AppContext';
import Moodem from './Moodem';

const controller = new AbortController();
LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Constants.manifest is null because the embedded app.config could not be read.'
]);

const App = () => {
    const [{ hasInternetConnection }, setInternetConnection] = useState({ hasInternetConnection: true });
    const [connectionParams, setConnectionParams] = useState(null);
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(connection => handleConnectivityChange(connection));

        return () => {
            unsubscribe();
            controller.abort();
        };
    }, [hasInternetConnection]);

    const handleConnectivityChange = (connection: any) => {
        setInternetConnection({
            hasInternetConnection: connection.isConnected
        });
        setConnectionParams({
            connectionParams: {
                connectionType: connection.type,
                connectionDetails: connection.details
            }
        });
        setIsloading(false);
    };

    if (!hasInternetConnection) {
        return (<OfflineNotice />);
    } else if (isLoading) {
        return (
            <ErrorBoundary>
                <BgImage />
                <PreLoader
                    containerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    size={50}
                />
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <AppContextProvider>
                <Moodem />
            </AppContextProvider>
        </ErrorBoundary>
    );
};

export default App;
