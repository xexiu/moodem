import React, { memo, useContext, useState } from 'react';
import { Keyboard } from 'react-native';
import { isEmulator } from 'react-native-device-info';
import NotificationsService from '../../../NotificationsService';
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
    const [unreadMsgs, setUnreadMsgs] = useState({});
    const { navigation } = props;
    const chatRoom = `ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}`;
    const { isLoading, deviceConfig, messages, connectedUsers } = useChatMessages(chatRoom, null, null, null);

    // function onNotification({ data }: any) {
    //     console.log('NOTIIIF');
    //     const { userSender } = data;
    //     return onPressAvatar(userSender);
    // }

    /* TO-DO */
    // Get unread messages from sender

    // socket.on('unread-messages', data => {
    //     console.log('Received data', data);
    //     setUnreadMsgs(data.msg);
    // });

    function onPressAvatar(currentMessage: any) {
        return navigation.navigate('PrivateUserMessageScreen', {
            currentMessage
        });
    }

    return (
        <BodyContainer>
            <BurgerMenuIcon
                customStyle={{ top: 0}}
                action={() => {
                    navigation.openDrawer();
                    Keyboard.dismiss();
                }}
            />
            <HeaderChat
                group={group}
                connectedUsers={connectedUsers}
            />
            {isLoading || isServerError ?
                <ChatLoading /> :
                <MemoizedChat
                    chatRoom={chatRoom}
                    socket={socket}
                    messages={messages}
                    user={user}
                    onChangeTextBtn={(attrs: any) => <SendBtnChat attrs={attrs} />}
                    sendMsgBtn={(message: any) => sendMsg(socket, user, message, chatRoom, deviceConfig)}
                    onPressAvatar={onPressAvatar}
                />
            }
        </BodyContainer>
    );
};

export default memo(ChatRoom);
