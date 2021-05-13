/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useRef } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';
import Songs from '../../User/functional-components/Songs';
import { AppContext } from '../../User/store-context/AppContext';
import { SongsContextProvider } from '../../User/store-context/SongsContext';
import BodyContainer from './BodyContainer';
import BurgerMenuIcon from './BurgerMenuIcon';

let firstServerError = false;

const WelcomeLanding = (props: any) => {
    const { navigation } = props;
    const { dispatchContextApp, group, isServerError, socket }: any = useContext(AppContext);
    const toastRef = useRef(null);

    useEffect(() => {
        socket.on('disconnect', () => {
            if (isServerError) {
                socket.open();
                return dispatchContextApp({
                    type: 'server_error', value: {
                        isServerError: true
                    }
                });
            }
        });

        socket.on('connect', () => {
            socket.emit('emit-message-welcomeMsg', { chatRoom: group.group_name });
            if (isServerError) {
                return dispatchContextApp({
                    type: 'server_error', value: {
                        isServerError: false
                    }
                });
            }
        });

        socket.on('get-message-welcomeMsg', (data: any) => {
            toastRef.current.show(data.welcomeMsg, 1000);
        });

        socket.on('connect_error', (error: any) => {
            // Send error to sentry server to catch downsides of server
            toastRef.current.show('Connecting to server...', DURATION.FOREVER);
            if (!isServerError && !firstServerError) {
                firstServerError = true;
                console.log('Error connecting to server: ', error.message);

                return dispatchContextApp({
                    type: 'server_error', value: {
                        isServerError: true
                    }
                });
            }
        });
        return () => {
            console.log('OFF Effect MediaItems');
            socket.off('emit-message-welcomeMsg');
            socket.off('get-message-welcomeMsg');
        };
    }, [group.group_name, isServerError]);

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => navigation.openDrawer()}
            />
            <SongsContextProvider>
                <Songs
                    navigation={navigation}
                />
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
