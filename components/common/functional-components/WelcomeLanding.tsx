/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { AppState, DevSettings } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import PreLoader from '../../common/functional-components/PreLoader';
import Songs from '../../User/functional-components/Songs';
import { AppContext } from '../../User/store-context/AppContext';
import { SongsContextProvider } from '../../User/store-context/SongsContext';
import BodyContainer from './BodyContainer';
import BurgerMenuIcon from './BurgerMenuIcon';

let serverError = false;

const WelcomeLanding = (props: any) => {
    const { navigation } = props;
    const { dispatchContextApp, group, isServerError, socket }: any = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
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
        socket.on('get-message-welcomeMsg', getWelcomeMsg);
        socket.on('connect', setServerConnectedBack);
        socket.emit('emit-message-welcomeMsg', { chatRoom: group.group_name });

        return () => {
            console.log('OFF WELCOME');
            AppState.removeEventListener('change', getUserBackOnline);
            socket.off('emit-message-welcomeMsg');
            socket.off('get-message-welcomeMsg');
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
            setIsLoading(false);
            return dispatchContextApp({
                type: 'server_error', value: {
                    isServerError: true
                }
            });
        }
    }

    function getWelcomeMsg({ welcomeMsg }: any) {
        toastRef.current.show(welcomeMsg, 1000, () => {
            setIsLoading(false);
        });

        if (isServerError) {
            return dispatchContextApp({
                type: 'server_error', value: {
                    isServerError: false
                }
            });
        }
    }

    if (isLoading) {
        return (
            <BodyContainer>
                <PreLoader
                    containerStyle={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    size={50}
                />
                <Toast
                    position={isServerError ? 'bottom' : 'top'}
                    ref={toastRef}
                />
            </BodyContainer>
        );
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
