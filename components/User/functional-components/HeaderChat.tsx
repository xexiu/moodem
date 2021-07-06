import React, { memo } from 'react';
import { View } from 'react-native';
import HeaderChatIconMessages from './HeaderChatIconMessages';
import HeaderChatTitle from './HeaderChatTitle';
import HeaderChatUsers from './HeaderChatUsers';

type PropsHeaderChat = {
    group: any,
    connectedUsers: number
};

const HeaderChat = ({ group, connectedUsers }: PropsHeaderChat) => {
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 1,
                paddingBottom: 5,
                borderBottomColor: '#eee',
                position: 'relative'
            }}
        >
            <HeaderChatTitle
                group={group}
            />
            <HeaderChatUsers
                connectedUsers={connectedUsers}
            />
            <HeaderChatIconMessages />
        </View>
    );
};

export default memo(HeaderChat);
