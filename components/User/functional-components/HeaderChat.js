/* eslint-disable max-len */
import React, { useState, useEffect, memo } from 'react';
import { View, Text, AppState } from 'react-native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { MediaBuilder } from '../../../src/js/Utils/Helpers/actions/common';

export const HeaderChat = memo(({ props, chatRoom }) => {
    const isDrawerOpen = useIsDrawerOpen();
    const [usersConnected = 0, setUsersConnected] = useState(0);
    const media = new MediaBuilder();
    const socket = media.socket();

    const getInactiveUsers = (data) => {
        if (data !== 'active') {
            socket.open();
            media.msgToServer(socket, 'get-connected-users', { leaveChatRoom: chatRoom, chatRoom });
        } else {
            socket.open();
            media.msgToServer(socket, 'get-connected-users', { chatRoom });
        }
    };

    useEffect(() => {
        console.log('4. Header ChatRoom');

        AppState.addEventListener('change', getInactiveUsers);

        if (isDrawerOpen) {
            media.msgToServer(socket, 'get-connected-users', { leaveChatRoom: chatRoom, chatRoom });
        } else {
            media.msgToServer(socket, 'get-connected-users', { chatRoom });
        }
        media.msgFromServer(socket, setUsersConnected, ['users-connected-to-room']);

        return () => {
            AppState.removeEventListener('change', getInactiveUsers);
            socket.disconnect();
            socket.off(media.msgFromServer);
            socket.close();
        };
    }, [isDrawerOpen, AppState]);

    return (
        <View style={{ marginTop: 35, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 }}>
            <Text>{`${props.route.params.group.group_name} Chat`}</Text>
            <Text style={{ fontSize: 12, paddingTop: 2, fontStyle: 'italic', color: '#777' }}>{usersConnected} connected</Text>
        </View>
    );
});
