import { useNavigation } from '@react-navigation/native';
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

        return () => {
            socket.off('reciever-unread-messages');
            socket.off('push-notification-received-msg');
        };
    }, [connectedUsers, isServerError]);

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
                sendMsgBtn={(message: any) => {
                    // Check if users connected = 1
                    // then add bad increase
                    // then emit push notification
                    if (connectedUsers === 1 && hasPushPermission()) {
                        Object.assign(message, {
                            msg: {
                                badge: messages[0].badge ? messages[0].badge++ : 0
                            }
                        });
                        socket.emit('push-notification-received-msg', {
                            user_receiver_msg: prevMessage,
                            user_sender_msg: messages[0]
                        });
                    } else if (connectedUsers === 2) {
                        Object.assign(message, {
                            msg: {
                                badge: 0
                            }
                        });
                    }

                    // if users connected = 2
                    // then reset badge to 0
                    // dont emit
                    return sendMsg(socket, user, message, chatRoom);
                }}
                disablePressAvatar={true}
            />
        </BodyContainer>
    );
};

export default memo(PrivateUserMessageScreen);
