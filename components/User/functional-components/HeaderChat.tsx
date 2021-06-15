/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { View } from 'react-native';
import HeaderChatIconMessages from './HeaderChatIconMessages';
import HeaderChatTitle from './HeaderChatTitle';
import HeaderChatUsers from './HeaderChatUsers';

const HeaderChat = (props: any) => {
    const { group } = props;

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
                chatRoom={`ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}`}
            />
            <HeaderChatIconMessages />
        </View>
    );
};

HeaderChat.propTypes = {
    props: PropTypes.any,
    group: PropTypes.object
};

export default memo(HeaderChat);
