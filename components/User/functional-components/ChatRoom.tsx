import PropTypes from 'prop-types';
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

const ChatRoom = (props: any) => {
    const { user, group, socket, isServerError }: any = useContext(AppContext);
    const { navigation } = props;
    const chatRoom = `ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}`;
    const { isLoading, messages } = useChatMessages(chatRoom);

    function onPressAvatar(currentMessage: any) {
        return navigation.navigate('PrivateUserMessageScreen', {
            currentMessage
        });
    }

    function renderLoading() {
        return (
            <ChatLoading />
        );
    }

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => {
                    navigation.openDrawer();
                    Keyboard.dismiss();
                }}
            />
            {isLoading || isServerError && renderLoading()}
            <HeaderChat
                group={group}
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

ChatRoom.propTypes = {
    navigation: PropTypes.object
};

export default memo(ChatRoom);
