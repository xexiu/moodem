import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useContext, useEffect } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import useChatMessages from '../../../components/User/custom-hooks/useChatMessages';
import ChatLoading from '../../../components/User/functional-components/ChatLoading';
import MemoizedChat from '../../../components/User/functional-components/MemoizedChat';
import SendBtnChat from '../../../components/User/functional-components/SendBtnChat';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { avatarChat } from '../../../src/css/styles/avatar';
import { NavigationOptions } from '../../../src/js/Utils/Helpers/actions/navigation';
import { sendMsg } from '../../../src/js/Utils/Helpers/connection/socket';

type PropsPrivateMessageUserScreen = {
    route: any,
    currentMessage: any
};

let isFistLanding = false;

const PrivateUserMessageScreen = (props: PropsPrivateMessageUserScreen) => {
    const { currentMessage: prevMessage } = props.route.params;
    const navigation = useNavigation();
    const navigationOptions = {
        ...NavigationOptions(navigation),
        title: (<View style={isOnline()}><Text style={{ color: '#999' }}>{prevMessage.user.name}</Text></View>)
    };
    const { user, group, socket, isServerError }: any = useContext(AppContext);
    const split = `${user.uid}--with--${prevMessage.user._id}`.split('--with--');
    const unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1));
    const chatRoom = `ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}_${unique[0]}--with--${unique[1]}`;
    const { isLoading, messages, connectedUsers } = useChatMessages(chatRoom, navigationOptions);
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
            title: (<View
                style={{
                    position: 'relative',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <FastImage
                    style={[avatarChat, {marginRight: 10 }]}
                    source={{
                        uri: prevMessage.user.avatar,
                        priority: FastImage.priority.high
                    }}
                />
                <Text style={isOnline()}>{prevMessage.user.name}</Text>
            </View>)
        });
        if (connectedUsers === 1 && messages.length && hasPushPermission() && isFocused) {
            if (messages.length === 1) {
                isFistLanding = true;
                return socket.emit('push-notification-received-msg', {
                    user_receiver_msg: prevMessage,
                    user_sender_msg: messages[0]
                });
            }
            if (!isFistLanding) {
                isFistLanding = true;
                return;
            }
            socket.emit('push-notification-received-msg', {
                user_receiver_msg: prevMessage,
                user_sender_msg: messages[0]
            });
        } else if (connectedUsers > 2) {
            socket.off('push-notification-received-msg');
        } else {
            isFistLanding = false;
        }

        return () => {
            socket.off('reciever-unread-messages');
            socket.off('push-notification-received-msg');
        };
    }, [connectedUsers, isServerError, isFocused, messages.length]);

    function hasPushPermission() {
        return prevMessage.user ? prevMessage.user.hasPushPermissions : false;
    }

    /* TO-DO */
    // Send unread messages to receiver

    function isOnline() {
        return {
            borderWidth: 1,
            borderColor: connectedUsers > 1 ? 'green' : '#999',
            padding: 5,
            borderRadius: 10,
            color: connectedUsers > 1 ? '#000' : '#999'
        };
    }

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
