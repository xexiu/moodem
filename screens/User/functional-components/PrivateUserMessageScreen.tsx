import React, { memo, useContext } from 'react';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import useChatMessages from '../../../components/User/custom-hooks/useChatMessages';
import ChatLoading from '../../../components/User/functional-components/ChatLoading';
import MemoizedChat from '../../../components/User/functional-components/MemoizedChat';
import SendBtnChat from '../../../components/User/functional-components/SendBtnChat';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { sendMsg } from '../../../src/js/Utils/Helpers/connection/socket';

type PropsPrivateMessageUserScreen = {
    route: any,
    currentMessage: any
};

const PrivateUserMessageScreen = (props: PropsPrivateMessageUserScreen) => {
    const { currentMessage } = props.route.params;
    const navigationOptions = {
        headerMode: 'none',
        unmountOnBlur: true,
        headerBackTitleVisible: false,
        unmountInactiveRoutes: true,
        title: `${currentMessage.user.name}`
    };
    const { user, group, socket, isServerError }: any = useContext(AppContext);
    const split = `${user.uid}--with--${currentMessage.user._id}`.split('--with--');
    const unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1));
    const chatRoom = `ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}_${unique[0]}--with--${unique[1]}`;
    const { isLoading, messages } = useChatMessages(chatRoom, navigationOptions);

    if (isLoading || isServerError) {
        return (
            <ChatLoading />
        );
    }

    return (
        <BodyContainer>
            <MemoizedChat
                chatRoom={chatRoom}
                socket={socket}
                messages={messages}
                user={user}
                onChangeTextBtn={(attrs: any) => <SendBtnChat attrs={attrs} />}
                sendMsgBtn={(message: any) => sendMsg(socket, user, message, chatRoom)}
                disablePressAvatar={true}
            />
        </BodyContainer>
    );
};

export default memo(PrivateUserMessageScreen);
