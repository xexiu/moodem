/* eslint-disable max-len */
import React, { useState, useEffect, useContext, memo } from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { useIsFocused } from '@react-navigation/native';
import { View, Keyboard } from 'react-native';
import { MediaBuilder } from '../../../src/js/Utils/Helpers/actions/common';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { MessagesListItem } from '../functional-components/MessagesListItem';
import { NewMessageChat } from '../functional-components/NewMessageChat';
import { HeaderChat } from '../functional-components/HeaderChat';
import { CommonTextInput } from '../../common/functional-components/CommonTextInput';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { UserContext } from '../functional-components/UserContext';

function setChatRoomName(group) {
    if (group.group_name && group.group_id) {
        return `${group.group_name}-ChatRoom${group.group_id}`;
    }
    return 'Moodem-ChatRoom';
}

const ChatRoom = memo((props) => {
    const isFocused = useIsFocused();
    const { user, group } = useContext(UserContext);
    const { navigation } = props;
    const [messages = [], setMessages] = useState([]);
    const [usersConnected = 0, setUsersConnected] = useState(0);
    const media = new MediaBuilder();
    const socket = media.socket();
    const headerTitle = `${props.route.params.group.group_name} Chat`; //this.props.route.params.group.group_name, 'Chat');

    useEffect(() => {
        console.log('5. ChatRoom');
        //media.msgFromServer(socket, getMessage, ['chat-messages']);
        media.msgFromServer(socket, setMessageList, ['moodem-chat']);
        media.msgFromServer(socket, getConnectedUsers, ['users-connected-to-room']);
        media.msgToServer(socket, 'moodem-chat', { chatRoom: setChatRoomName(props.route.params.group), user: user || { displayName: 'Guest' } });

        return () => {
            console.log('5. OFF EFFECT ChatRoom');
            media.msgToServer(socket, 'moodem-chat', { leaveChatRoom: setChatRoomName(props.route.params.group) });
            socket.disconnect();
            socket.off(media.msgFromServer);
            socket.close();
        };
    }, [messages.length]);

    const getConnectedUsers = (_usersConnected) => {
        //const numConnectedUsers = messages.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i).length;
        if (_usersConnected) {
            setUsersConnected(_usersConnected);
        }
    };

    const setMessageList = (messagesList) => {
        //console.log('MESSAGES  LIST', messagesList);
        setMessages([...messagesList]);
    };


    return (
        <View style={{ backgroundColor: '#fff', flex: 1, position: 'relative' }}>
            <BurgerMenuIcon
                customStyle={{ top: 20, left: 0, width: 30, height: 30 }}
                action={() => {
                    navigation.openDrawer();
                    Keyboard.dismiss();
                }}
            />
            <HeaderChat headerTitle={headerTitle} usersConnected={usersConnected} />
            <View style={{ flex: 2, paddingBottom: 15 }}>
                <NewMessageChat messagesList={messages} navigation={navigation} chatRoom={setChatRoomName(props.route.params.group)} />
            </View>
            <KeyboardSpacer />
        </View>
    );
});

ChatRoom.navigationOptions = ({ route }) => {
    console.log('ChatRoom Navigation Options', route);
    return {
        unmountOnBlur: true,
        headerBackTitle: '',
        title: `${route.params.group.group_name} Chat` //getGroupName(route.params.group.group_name, 'Chat')
    };
};

export {
    ChatRoom
};

