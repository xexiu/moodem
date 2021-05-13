import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import BodyContainer from '../../common/functional-components/BodyContainer';
import BurgerMenuIcon from '../../common/functional-components/BurgerMenuIcon';
import CommonTextInput from '../../common/functional-components/CommonTextInput';
import HeaderChat from '../functional-components/HeaderChat';
import HeaderChatTitle from '../functional-components/HeaderChatTitle';
import HeaderChatUsers from '../functional-components/HeaderChatUsers';
import MessagesList from '../functional-components/MessagesList';
import { AppContext } from '../store-context/AppContext';

const ChatRoom = (props: any) => {
    const { user, group, socket }: any = useContext(AppContext);
    const { navigation } = props;
    const [messages = [], setMessages] = useState([]);

    useEffect(() => {
        console.log('5. ChatRoom');
        socket.on('chat-messages', getMessage);
        socket.on('moodem-chat', setMessageList);
        socket.emit('moodem-chat',
            { chatRoom: `${group.group_name}-ChatRoom-${group.group_id}`, user });

        return () => {
            console.log('5. OFF EFFECT ChatRoom');
            // socket.disconnect();
        };
    }, []);

    console.log('CHATTT');

    const getMessage = (msg: never) => {
        console.log('Heyyy', msg);
        if (msg) {
            setMessages([msg, ...messages]);
        }
    };

    const setMessageList = (messagesList: never[]) => {
        setMessages([...messagesList]);
    };

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
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <View style={{ flex: 1 }}>
                    <MessagesList messages={messages} />
                </View>
            </TouchableWithoutFeedback>
            <View style={{ height: 50 }}>
                <View style={{ position: 'absolute', bottom: 5, right: 0, left: 7, width: '96%', zIndex: 1 }}>
                    <CommonTextInput
                        navigation={navigation}
                        user={user}
                        group={group}
                        socket={socket}
                    />
                </View>
            </View>
            <KeyboardSpacer
                topSpacing={0}
            />
        </BodyContainer>
    );
};

ChatRoom.propTypes = {
    navigation: PropTypes.object
};

export default memo(ChatRoom);
