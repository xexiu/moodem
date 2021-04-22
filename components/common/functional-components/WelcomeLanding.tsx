/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useRef } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';
import Songs from '../../User/functional-components/Songs';
import { AppContext } from '../../User/store-context/AppContext';
import { SongsContextProvider } from '../../User/store-context/SongsContext';
import { AbstractMedia } from './AbstractMedia';
import BodyContainer from './BodyContainer';
import BurgerMenuIcon from './BurgerMenuIcon';

let firstServerError = false;

const WelcomeLanding = (props: any) => {
    const { navigation } = props;
    const { dispatchContextApp, group, isServerError }: any = useContext(AppContext);
    const media = new AbstractMedia();
    const toastRef = useRef(null);

    useEffect(() => {
        media.on('disconnect', () => {
            if (isServerError) {
                return dispatchContextApp({
                    type: 'server_error', value: {
                        isServerError: true
                    }
                });
            }
        });

        media.on('connect', () => {
            media.emit('emit-message-welcomeMsg', { chatRoom: group.group_name });
            if (isServerError) {
                return dispatchContextApp({
                    type: 'server_error', value: {
                        isServerError: false
                    }
                });
            }
        });

        media.on('get-message-welcomeMsg', (data: any) => {
            toastRef.current.show(data.welcomeMsg, 1000);
        });

        media.on('connect_error', (error: any) => {
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
            media.socket.off('emit-message-welcomeMsg');
            media.socket.off('get-message-welcomeMsg');
        };
    }, [group.group_name, isServerError]);

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => navigation.openDrawer()}
            />
            <SongsContextProvider>
                <Songs
                    media={media}
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
