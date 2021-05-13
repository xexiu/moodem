/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useState } from 'react';
import { AppState, Text } from 'react-native';
import { AppContext } from '../../User/store-context/AppContext';

const HeaderChatUsers = (props: any) => {
    const { socket }: any = useContext(AppContext);
    const {
        chatRoom
    } = props;
    const isFocused = useIsFocused();
    const [usersConnected = 0, setUsersConnected] = useState(0);

    const getInactiveUsers = (data: any) => {
        if (data !== 'active') {
            socket.open();
            socket.emit('get-connected-users', { leaveChatRoom: chatRoom, chatRoom });
        } else {
            socket.open();
            socket.emit('get-connected-users', { chatRoom });
        }
    };

    useEffect(() => {
        AppState.addEventListener('change', getInactiveUsers);

        if (isFocused) {
            socket.emit('get-connected-users', { chatRoom });
        } else {
            socket.emit('get-connected-users', { leaveChatRoom: chatRoom, chatRoom });
        }
        socket.on('users-connected-to-room', setUsersConnected);

        return () => {
            AppState.removeEventListener('change', getInactiveUsers);
            socket.emit('get-connected-users', { leaveChatRoom: chatRoom, chatRoom });
            socket.disconnect();
        };
    }, [isFocused]);

    return (
        <Text
            style={{
                fontSize: 12,
                paddingTop: 2,
                fontStyle: 'italic',
                color: '#777'
            }}
        >
            {usersConnected} connected
        </Text>
    );
};

HeaderChatUsers.propTypes = {
    props: PropTypes.any,
    chatRoom: PropTypes.string
};

export default memo(HeaderChatUsers);
