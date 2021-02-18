/* eslint-disable max-len */
import React, { useState, useEffect, useContext, useCallback, memo } from 'react';
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

const buildMsg = (value, user) => ({
    id: Object.keys(user || {}).length ? `${user.uid}_${Math.random(10000)}` : Math.random(10000),
    text: value ? value.replace(/^\s*\n/gm, '') : '',
    user
});


const ChatRoom = memo((props) => {
    const isFocused = useIsFocused();
    const { user, group } = useContext(UserContext);
    const { navigation } = props;
    const [messages = [], setMessages] = useState([]);
    const [usersConnected = 0, setUsersConnected] = useState(0);
    const media = new MediaBuilder();
    const socket = media.socket();
    const headerTitle = `${props.route.params.group.group_name} Chat`; //this.props.route.params.group.group_name, 'Chat');
    const forceUpdate = useCallback((param) => setUsersConnected(param), []);

    useEffect(() => {
        console.log('6. ChatRoom');
        media.msgFromServer(socket, getMessage, ['chat-messages']);
        media.msgFromServer(socket, setMessageList, ['moodem-chat']);
        //media.msgFromServer(socket, getConnectedUsers, ['users-connected-to-room']);
        media.msgToServer(socket, 'moodem-chat', { chatRoom: setChatRoomName(props.route.params.group), user: user || { displayName: 'Guest' } });

        return () => {
            console.log('5. OFF EFFECT ChatRoom');
            socket.disconnect();
            socket.off(media.msgFromServer);
            socket.close();
        };
    }, [messages.length]);

    const getMessage = (msg) => {
        if (msg) {
            setMessages([msg, ...messages]);
            console.log('MESSSAGEssss', messages);
        }
    };

    const setMessageList = (messagesList) => {
        console.log('MESSAGES  LIST', messagesList);
        setMessages([...messagesList]);
    };

    const renderItem = ({ item }) => (
        <MessagesListItem msg={item} />
    );

    const sendNewMsg = (value) => {
        console.log('SENND NEW MSG', value);
        media.msgToServer(socket, 'chat-messages', { chatRoom: setChatRoomName(props.route.params.group), msg: buildMsg(value, user), user: user || { displayName: 'Guest' } });
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
            <HeaderChat props={props} chatRoom={setChatRoomName(props.route.params.group)} />
            <View style={{ flex: 2, paddingBottom: 15 }}>
                <CommonFlatList
                    data={messages}
                    extraData={messages}
                    keyExtractor={item => String(item.id)}
                    inverted
                    action={renderItem}
                />
                <View style={{ height: 50 }}>
                    <View style={{ position: 'absolute', bottom: 0, right: 0, left: 7, width: '96%', zIndex: 1 }}>
                        <CommonTextInput navigation={navigation} user={user} callback={sendNewMsg} />
                    </View>
                </View>
            </View>
            <KeyboardSpacer />
        </View>
    );
});

ChatRoom.navigationOptions = ({ route }) =>
//console.log('ChatRoom Navigation Options', route);
({
    unmountOnBlur: true,
    headerBackTitle: '',
    title: `${route.params.group.group_name} Chat` //getGroupName(route.params.group.group_name, 'Chat')
});

export {
    ChatRoom
};

