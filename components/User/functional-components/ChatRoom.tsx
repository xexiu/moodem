import React, { memo, useContext } from 'react';
import { Keyboard } from 'react-native';
import { sendMsg } from '../../../src/js/Utils/Helpers/connection/socket';
import { BodyContainer } from '../../common/functional-components/BodyContainer';
import BurgerMenuIcon from '../../common/functional-components/BurgerMenuIcon';
import useChatMessages from '../custom-hooks/useChatMessages';
import { AppContext } from '../store-context/AppContext';
import ChatLoading from './ChatLoading';
import HeaderChat from './HeaderChat';
import MemoizedChat from './MemoizedChat';
import SendBtnChat from './SendBtnChat';

type PropsChat = {
    navigation?: any
};

const ChatRoom = (props: PropsChat) => {
    const { user, group, socket, isServerError }: any = useContext(AppContext);
    const { navigation } = props;
    const chatRoom = `ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}`;
    const { isLoading, messages, connectedUsers } = useChatMessages(chatRoom);

    if (isLoading || isServerError) {
        return (
            <ChatLoading />
        );
    }

    function onPressAvatar(currentMessage: any) {
        return navigation.navigate('PrivateUserMessageScreen', {
            currentMessage
        });
    }

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => {
                    navigation.openDrawer();
                    Keyboard.dismiss();
                }}
            />
            <HeaderChat
                group={group}
                connectedUsers={connectedUsers}
            />
            <MemoizedChat
                chatRoom={chatRoom}
                socket={socket}
                messages={messages}
                user={user}
                onChangeTextBtn={(attrs: any) => <SendBtnChat attrs={attrs} />}
                sendMsgBtn={(message: any) => sendMsg(socket, user, message, chatRoom)}
                onPressAvatar={onPressAvatar}
            />
        </BodyContainer>
    );
};

export default memo(ChatRoom);
