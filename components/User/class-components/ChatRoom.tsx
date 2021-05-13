import PropTypes from 'prop-types';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { Icon } from 'react-native-elements';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import BodyContainer from '../../common/functional-components/BodyContainer';
import BurgerMenuIcon from '../../common/functional-components/BurgerMenuIcon';
import HeaderChat from '../functional-components/HeaderChat';
import HeaderChatTitle from '../functional-components/HeaderChatTitle';
import HeaderChatUsers from '../functional-components/HeaderChatUsers';
import { AppContext } from '../store-context/AppContext';

const styles = {
    sendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 15
    }
};

const ChatRoom = (props: any) => {
    const { user, group, socket }: any = useContext(AppContext);
    const { navigation } = props;
    const [messages = [], setMessages] = useState([]);

    useEffect(() => {
        socket.on('moodem-chat', setMessageList);
        socket.on('chat-messages', getMessage);
        socket.emit('moodem-chat',
            { chatRoom: `${group.group_name}-ChatRoom-${group.group_id}`, user });

        return () => {
            console.log('5. OFF EFFECT ChatRoom');
            socket.close();
        };
    }, []);

    const setMessageList = (messagesList: never[]) => {
        setMessages([...messagesList]);
    };

    function getMessage(msg: any) {
        setMessages(previousMessages => GiftedChat.append(previousMessages, msg));
    }

    const renderSend = (propsSendBtn: any) => {
        return (
            <Send
                {...propsSendBtn}
                containerStyle={styles.sendContainer}
            >
                <Icon
                    name='send-o'
                    type='font-awesome'
                    color='#1E90FF'
                    size={20}
                />
            </Send>
        );
    };

    const onSend = useCallback((message: any) => {
        socket.emit('chat-messages',
            {
                chatRoom: `${group.group_name}-ChatRoom-${group.group_id}`,
                msg: {
                    text: message.text,
                    user: {
                        _id: message.user._id,
                        name: message.user.name
                    },
                    createdAt: message.createdAt,
                    _id: message._id
                }
            });
    }, []);

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => {
                    navigation.openDrawer();
                    Keyboard.dismiss();
                }}
            />
            <HeaderChat>
                <HeaderChatTitle group={group} />
                <HeaderChatUsers
                    chatRoom={`${group.group_name}-ChatRoom-${group.group_id}`}
                />
            </HeaderChat>
            <GiftedChat
                // isTyping
                loadEarlier
                placeholder='Escribe algo...'
                infiniteScroll
                alwaysShowSend
                renderUsernameOnMessage
                showAvatarForEveryMessage
                messages={messages}
                renderSend={renderSend}
                onSend={msgs => onSend(msgs[0])}
                keyboardShouldPersistTaps='never'
                showUserAvatar
                inverted

                user={{
                    _id: user.uid,
                    name: user.displayName
                }}
            />
        </BodyContainer>
    );
};

ChatRoom.propTypes = {
    navigation: PropTypes.object
};

export default memo(ChatRoom);
