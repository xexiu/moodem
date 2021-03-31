/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import Toast from 'react-native-easy-toast';
import { useCallbackRef } from 'use-callback-ref';
import BasePlayer from '../common/BasePlayer';
import BurgerMenuIcon from '../common/BurgerMenuIcon';
import { AbstractMedia } from '../common/functional-components/AbstractMedia';
import BodyContainer from '../common/functional-components/BodyContainer';
import SearchBarAutoComplete from '../common/functional-components/SearchBarAutoComplete';
import { AppContext } from './functional-components/AppContext';
import Songs from './functional-components/Songs';

const MediaItems = (props: any) => {
    const { navigation } = props;
    const { group }: any = useContext(AppContext);
    const isFocused = useIsFocused();
    const media = new AbstractMedia();
    const toastRef = useRef(null);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isFocused) {
            media.on('get-message-welcomeMsg', async(data: any) => {
                toastRef.current.show(data.welcomeMsg, 1000, () => {
                    setIsLoading(false);
                });
            });
            media.emit('emit-message-welcomeMsg', { chatRoom: group.group_name });

            media.on('connect_error', function (e) {
                // Send error to sentry server to catch downsides of server
                console.log('Error connecting to server: ', e);
                toastRef.current.show('Connecting to server...', 4000);
                forceUpdate();
            });
        }
        return () => {
            //media.destroy();
            console.log('OFF Effect MediaItems');
            media.socket.off('emit-message-welcomeMsg');
            media.socket.off('get-message-welcomeMsg');
        };
    }, [group.group_name]);

    if (isLoading) {
        return (
            <Toast
                position='top'
                ref={toastRef}
            />
        );
    }

    return (
        <BodyContainer>
            <Songs
                media={media}
                navigation={navigation}
            />
            <Toast
                position='top'
                ref={toastRef}
            />
        </BodyContainer>
    );
};

export default memo(MediaItems);
