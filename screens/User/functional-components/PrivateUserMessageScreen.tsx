import { CommonActions } from '@react-navigation/native';
import React, { memo, useContext, useEffect } from 'react';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import useChatMessages from '../../../components/User/custom-hooks/useChatMessages';
import ChatLoading from '../../../components/User/functional-components/ChatLoading';
import MemoizedChat from '../../../components/User/functional-components/MemoizedChat';
import SendBtnChat from '../../../components/User/functional-components/SendBtnChat';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { sendMsg } from '../../../src/js/Utils/Helpers/connection/socket';

const PrivateUserMessageScreen = (props: any) => {
    const { currentMessage } = props.route.params;
    const { user, socket, isServerError }: any = useContext(AppContext);
    const split = `${user.uid}--with--${currentMessage.user._id}`.split('--with--');
    const unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1));
    const updatedRoomName = `${unique[0]}--with--${unique[1]}`;
    const { isLoading, messages } = useChatMessages(updatedRoomName, {
        headerMode: 'none',
        unmountOnBlur: true,
        headerBackTitleVisible: false,
        unmountInactiveRoutes: true,
        title: `${currentMessage.user.name}`
    });

    if (isLoading || isServerError) {
        return (
            <ChatLoading />
        );
    }

    return (
        <BodyContainer>
            <MemoizedChat
                chatRoom={updatedRoomName}
                socket={socket}
                messages={messages}
                user={user}
                onChangeTextBtn={(attrs: any) => <SendBtnChat attrs={attrs} />}
                sendMsgBtn={(message: any) => sendMsg(socket, user, message, updatedRoomName)}
                disablePressAvatar={true}
            />
        </BodyContainer>
    );
};

export default memo(PrivateUserMessageScreen);
