import React, { memo } from 'react';
import { Text } from 'react-native';

type PropsHeaderChatUsers = {
    connectedUsers: number
}

const HeaderChatUsers = ({ connectedUsers }: PropsHeaderChatUsers) => {
    return (
        <Text
            style={{
                fontSize: 12,
                paddingTop: 2,
                fontStyle: 'italic',
                color: '#777'
            }}
        >
            {connectedUsers} connected
        </Text>
    );
};

export default memo(HeaderChatUsers);
