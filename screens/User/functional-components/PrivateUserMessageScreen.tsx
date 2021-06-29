import { useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import BurgerMenuIcon from '../../../components/common/functional-components/BurgerMenuIcon';
import MemoizedChat from '../../../components/User/functional-components/MemoizedChat';
import SendBtnChat from '../../../components/User/functional-components/SendBtnChat';
import { AppContext } from '../../../components/User/store-context/AppContext';

const PrivateUserMessageScreen = (props: any) => {
    const { currentMessage } = props.route.params;
    const { navigation } = props;
    const { user, socket, isServerError }: any = useContext(AppContext);
    const [allValues, setValues] = useState({
        messages: [],
        isLoading: true
    });
    const isFocused = useIsFocused();

    const split = `${user.uid}--with--${currentMessage.user._id}`.split('--with--');
    const unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1));
    const updatedRoomName = `${unique[0]}--with--${unique[1]}`;

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true,
            title: `${currentMessage.user.name}`
        });

        if (!isServerError && isFocused) {
            socket.on('moodem-chat', setMessageList);
            socket.on('chat-messages', getMessage);
            socket.emit('moodem-chat',
                {
                    chatRoom: updatedRoomName
                });
        }

        return () => {
            socket.off('moodem-chat', setMessageList);
            socket.off('chat-messages', getMessage);
        };
    }, [isServerError, isFocused]);

    const setMessageList = (messagesList: never[]) => {
        // socket.off('moodem-chat', setMessageList);
        return setValues((prev: any) => {
            return {
                ...prev,
                isLoading: false,
                messages: [...messagesList]
            };
        });
    };

    function getMessage(msg: any) {
        return setValues((prev: any) => {
            return {
                ...prev,
                messages: GiftedChat.append(prev.messages, msg)
            };
        });
    }

    const memoizedRenderSendBtn = useCallback((attrs: any) => {
        return (
            <SendBtnChat attrs={attrs} />
        );
    }, []);

    const memoizedOnSend = useCallback((message: any) => {
        socket.emit('chat-messages',
            {
                chatRoom: updatedRoomName,
                msg: {
                    text: message.text,
                    user: {
                        _id: message.user._id,
                        name: message.user.name,
                        avatar: user.photoURL || '',
                        user_id: user.uid
                    },
                    createdAt: message.createdAt,
                    _id: message._id
                }
            });
    }, []);

    return (
        <BodyContainer>
            <MemoizedChat
                chatRoom={updatedRoomName}
                socket={socket}
                onPressAvatar={() => {}}
                messages={allValues.messages}
                user={user}
                memoizedRenderSendBtn={memoizedRenderSendBtn}
                memoizedOnSend={memoizedOnSend}
            />
        </BodyContainer>
    );
};

export default memo(PrivateUserMessageScreen);
