/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useRef } from 'react';
import { AppState, DevSettings } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import Songs from '../../User/functional-components/Songs';
import { AppContext } from '../../User/store-context/AppContext';
import { SongsContextProvider } from '../../User/store-context/SongsContext';
import BodyContainer from './BodyContainer';
import BurgerMenuIcon from './BurgerMenuIcon';

let serverError = false;

const WelcomeLanding = (props: any) => {
    const { navigation } = props;
    const { dispatchContextApp, group, isServerError, socket }: any = useContext(AppContext);
    const toastRef = useRef(null);

    const getUserBackOnline = (data: any) => {
        if (data !== 'active') {
            socket.open();
        } else {
            socket.open();
        }
    };

    useEffect(() => {
        AppState.addEventListener('change', getUserBackOnline);
        socket.on('connect_error', getConnectionError);
        socket.on('connect', setServerConnectedBack);

        return () => {
            console.log('OFF WELCOME');
            AppState.removeEventListener('change', getUserBackOnline);
            socket.off('emit-set-medias');
            socket.off('get-medias-group');
            socket.off('connect_error', getConnectionError);
            socket.off('disconnect');

        };
    }, [group.group_name, isServerError]);

    function setServerConnectedBack() {
        // Server has connected back from error.
        if (serverError) {
            serverError = false;
            DevSettings.reload();
            return dispatchContextApp({
                type: 'server_error', value: {
                    isServerError: false
                }
            });
        }
    }

    function getConnectionError(error: any) {
        toastRef.current.show('Connecting to server...', DURATION.FOREVER);

        if (!serverError) {
            // Send error to sentry
            serverError = true;
            return dispatchContextApp({
                type: 'server_error', value: {
                    isServerError: true
                }
            });
        }
    }

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => navigation.openDrawer()}
            />
            <SongsContextProvider>
                <Songs navigation={navigation} />
            </SongsContextProvider>
            <Toast
                position={isServerError ? 'bottom' : 'top'}
                ref={toastRef}
            />
        </BodyContainer>
    );
};

WelcomeLanding.propTypes = {
    navigation: PropTypes.any
};

export default memo(WelcomeLanding);
