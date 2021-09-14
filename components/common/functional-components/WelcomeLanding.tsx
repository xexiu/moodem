import React, { memo, useContext, useEffect, useRef } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';
import Songs from '../../User/functional-components/Songs';
import { AppContext } from '../../User/store-context/AppContext';
import { BodyContainer } from './BodyContainer';
import BurgerMenuIcon from './BurgerMenuIcon';

let serverError = false;

const WelcomeLanding = (props: any) => {
    const { navigation } = props;
    const { dispatchContextApp, group, isServerError, socket }: any = useContext(AppContext);
    const toastRef = useRef() as any;

    useEffect(() => {
        socket.on('connect_error', getConnectionError);
        socket.on('connect', setServerConnectedBack);

        return () => {
            socket.off('connect_error', getConnectionError);
            socket.off('disconnect');

        };
    }, [group.group_id, isServerError, serverError]);

    function setServerConnectedBack() {
        // Server has connected back from error.
        if (serverError) {
            serverError = false;
            // DevSettings.reload();
            toastRef?.current?.close();
            return dispatchContextApp({
                type: 'server_error', value: {
                    isServerError: false,
                    isLoading: false
                }
            });
        }
    }

    function getConnectionError(error: any) {
        toastRef.current.show('Connecting to server...', DURATION.FOREVER);

        if (!serverError) {
            console.warn('getConnectionError', error);
            serverError = true;
            return dispatchContextApp({
                type: 'server_error', value: {
                    isServerError: true,
                    isLoading: false
                }
            });
        }
    }

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => navigation.openDrawer()}
            />
            <Songs />
            <Toast
                position={isServerError ? 'bottom' : 'top'}
                ref={toastRef}
            />
        </BodyContainer>
    );
};

export default memo(WelcomeLanding);
