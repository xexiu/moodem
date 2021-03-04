/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import { AppState, Text } from 'react-native';
import { AbstractMedia } from '../../common/functional-components/AbstractMedia';

const HeaderChatUsers = (props: any) => {
    const {
        chatRoom
    } = props;
    const isFocused = useIsFocused();
    const [usersConnected = 0, setUsersConnected] = useState(0);
    const media = new AbstractMedia();

    const getInactiveUsers = (data: any) => {
        if (data !== 'active') {
            media.socket.open();
            media.emit('get-connected-users', { leaveChatRoom: chatRoom, chatRoom });
        } else {
            media.socket.open();
            media.emit('get-connected-users', { chatRoom });
        }
    };

    useEffect(() => {
        AppState.addEventListener('change', getInactiveUsers);

        if (isFocused) {
            media.emit('get-connected-users', { chatRoom });
        } else {
            media.emit('get-connected-users', { leaveChatRoom: chatRoom, chatRoom });
        }
        media.on('users-connected-to-room', setUsersConnected);

        return () => {
            AppState.removeEventListener('change', getInactiveUsers);
            media.emit('get-connected-users', { leaveChatRoom: chatRoom, chatRoom });
            media.destroy();
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
