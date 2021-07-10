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
import { COMMON_NAVIGATION_OPTIONS } from '../../../src/js/Utils/constants/navigation';
import { sendMsg } from '../../../src/js/Utils/Helpers/connection/socket';

type PropsPrivateMessageUserScreen = {
    route: any,
    currentMessage: any
};

const PrivateUserMessageScreen = (props: PropsPrivateMessageUserScreen) => {
    const { currentMessage } = props.route.params;
    const navigation = useNavigation();
    const navigationOptions = {
        ...COMMON_NAVIGATION_OPTIONS,
        title: (<View style={isOnline()}><Text style={{ color: '#999' }}>{currentMessage.user.name}</Text></View>)
    };
    const { user, group, socket, isServerError }: any = useContext(AppContext);
    const split = `${user.uid}--with--${currentMessage.user._id}`.split('--with--');
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
                        uri: currentMessage.user.avatar,
                        priority: FastImage.priority.high
                    }}
                />
                <Text style={isOnline()}>{currentMessage.user.name}</Text>
            </View>)
        });
        return () => {
            socket.off('reciever-unread-messages');
        };
    }, [connectedUsers, isServerError]);

    /* TO-DO */
    // Send unread messages to receiver

    // if (connectedUsers === 1 && messages.length) {
    //     const msg = Object.assign(messages[0], {
    //         receiver: currentMessage.user._id,
    //         sender: user.uid
    //     });
    //     socket.emit('reciever-unread-messages', {
    //         msg
    //     });
    // }

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
