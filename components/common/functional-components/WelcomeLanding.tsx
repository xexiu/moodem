/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import Songs from '../../User/functional-components/Songs';
import { AppContext } from '../../User/store-context/AppContext';
import { SongsContextProvider } from '../../User/store-context/SongsContext';
import BodyContainer from './BodyContainer';
import BurgerMenuIcon from './BurgerMenuIcon';

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

        if (socket.disconnected) {
            socket.open();
            toastRef.current.show('Connecting to server...', DURATION.FOREVER);
        }

        socket.on('disconnect', () => {
            toastRef.current.show('Connecting to server...', DURATION.FOREVER);

            if (!isServerError) {
                return dispatchContextApp({
                    type: 'server_error', value: {
                        isServerError: true
                    }
                });
            }
        });

        socket.emit('emit-message-welcomeMsg', { chatRoom: group.group_name });

        socket.on('get-message-welcomeMsg', (data: any) => {
            toastRef.current.show(data.welcomeMsg, 1000);

            if (isServerError) {
                return dispatchContextApp({
                    type: 'server_error', value: {
                        isServerError: false
                    }
                });
            }
        });
        return () => {
            AppState.removeEventListener('change', getUserBackOnline);
            socket.off('emit-message-welcomeMsg');
            socket.off('get-message-welcomeMsg');
            socket.off('disconnect');
            socket.off('disconnect');
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
