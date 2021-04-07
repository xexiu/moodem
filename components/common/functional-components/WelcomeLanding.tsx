/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';
import { AppContext } from '../../User/functional-components/AppContext';
import Songs from '../../User/functional-components/Songs';
import { AbstractMedia } from './AbstractMedia';
import BodyContainer from './BodyContainer';
import BurgerMenuIcon from './BurgerMenuIcon';

const WelcomeLanding = (props: any) => {
    const { navigation } = props;
    const { group }: any = useContext(AppContext);
    const media = new AbstractMedia();
    const toastRef = useRef(null);
    const [isServerError, setIsServerError] = useState(false);

    useEffect(() => {
        media.on('disconnect', () => {
            console.log('Client HAS DISCONNECTEd');
        });
        media.on('connect', () => {
            console.log('Connected');
            media.emit('emit-message-welcomeMsg', { chatRoom: group.group_name });
        });

        media.on('get-message-welcomeMsg', (data: any) => {
            toastRef.current.show(data.welcomeMsg, 1000, setIsServerError(false));
        });

        media.on('connect_error', (error: any) => {
            // Send error to sentry server to catch downsides of server
            console.log('Error connecting to server: ', error);
            toastRef.current.show('Connecting to server...', DURATION.FOREVER, setIsServerError(true));
        });
        return () => {
            // media.destroy();
            console.log('OFF Effect MediaItems');
            media.socket.off('emit-message-welcomeMsg');
            media.socket.off('get-message-welcomeMsg');
        };
    }, [group.group_name]);

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => navigation.openDrawer()}
            />
            <Songs
                media={media}
                navigation={navigation}
                isServerError={isServerError}
            />
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
