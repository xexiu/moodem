/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useContext, useEffect, useRef } from 'react';
import Toast from 'react-native-easy-toast';
import BurgerMenuIcon from '../common/BurgerMenuIcon';
import { AbstractMedia } from '../common/functional-components/AbstractMedia';
import BodyContainer from '../common/functional-components/BodyContainer';
import SearchBarAutoComplete from '../common/functional-components/SearchBarAutoComplete';
import { AppContext } from './functional-components/AppContext';
import Songs from './functional-components/Songs';

function useHookWithRefCallback(ref: any) {
    return useCallback(node => {
        if (ref.current) {
            // Make sure to cleanup any events/references added to the last instance
        }

        if (node) {
            // Check if a node is actually passed. Otherwise node would be null.
            // You can now do what you need to, addEventListeners, measure, etc.
        }

        // Save a reference to the node
        ref.current = node;
    }, []);
}

const MediaItems = (props: any) => {
    const { navigation } = props;
    const { group }: any = useContext(AppContext);
    const isFocused = useIsFocused();
    const media = new AbstractMedia();
    const toastRef = useRef(null);

    useEffect(() => {
        if (isFocused) {
            media.on('get-message-welcomeMsg', (data: any) => {
                toastRef.current.show(data.welcomeMsg, 3000);
            });
            media.emit('emit-message-welcomeMsg', { chatRoom: group.group_name });

        }
        return () => {
            media.destroy();
        };
    }, [group.group_name]);

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
