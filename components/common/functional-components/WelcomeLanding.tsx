/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';
import Songs from '../../User/functional-components/Songs';
import { AppContext } from '../../User/store-context/AppContext';
import { SongsContextProvider } from '../../User/store-context/SongsContext';
import { AbstractMedia } from './AbstractMedia';
import BodyContainer from './BodyContainer';
import BurgerMenuIcon from './BurgerMenuIcon';

let hasError = false;

const WelcomeLanding = (props: any) => {
    const { navigation } = props;
    const { group }: any = useContext(AppContext);
    const media = new AbstractMedia();
    const toastRef = useRef(null);
    const [allValues, setAllValues] = useState({
        isServerError: false,
        isLoading: true
    });

    function resetLoading(serverError: boolean, loading: boolean) {
        setAllValues((prev: any) => {
            return {
                ...prev,
                isServerError: serverError,
                isLoading: loading
            };
        });
    }

    useEffect(() => {
        media.on('disconnect', () => {
            console.log('Client HAS DISCONNECTED');
        });
        media.on('connect', () => {
            console.log('Connected BACK');
            media.emit('emit-message-welcomeMsg', { chatRoom: group.group_name });
        });

        media.on('get-message-welcomeMsg', (data: any) => {
            toastRef.current.show(data.welcomeMsg, 1000, () => resetLoading(false, false));
        });

        media.on('connect_error', (error: any) => {
            // Send error to sentry server to catch downsides of server
            console.log('Error connecting to server: ', error);
            toastRef.current.show('Connecting to server...', DURATION.FOREVER);
            if (!hasError) {
                hasError = true;
                resetLoading(true, false);
            }
        });
        return () => {
            // media.destroy();
            console.log('OFF Effect MediaItems');
            media.socket.off('emit-message-welcomeMsg');
            media.socket.off('get-message-welcomeMsg');
        };
    }, [group.group_name]);

    if (allValues.isLoading) {
        return (
            <Toast
                position={allValues.isServerError ? 'bottom' : 'top'}
                ref={toastRef}
            />
        );
    }

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => navigation.openDrawer()}
            />
            <SongsContextProvider>
                <Songs
                    media={media}
                    navigation={navigation}
                    isServerError={allValues.isServerError}
                />
            </SongsContextProvider>
            <Toast
                position={allValues.isServerError ? 'bottom' : 'top'}
                ref={toastRef}
            />
        </BodyContainer>
    );
};

WelcomeLanding.propTypes = {
    navigation: PropTypes.any
};

export default memo(WelcomeLanding);
