import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { MediaBuilder } from '../../../src/js/Utils/Helpers/actions/common';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonTextInput } from '../../common/functional-components/CommonTextInput';
import { AppContext } from '../functional-components/AppContext';
import { HeaderChat } from '../functional-components/HeaderChat';
import { MessagesListItem } from '../functional-components/MessagesListItem';

function setChatRoomName(group: any) {
    if (group.group_name && group.group_id) {
        return `${group.group_name}-ChatRoom${group.group_id}`;
    }
    return 'Moodem-ChatRoom';
}

const buildMsg = (value: string, user: any) => ({
    id: Object.keys(user || {}).length ? `${user.uid}_${Math.random()}` : Math.random(),
    text: value ? value.replace(/^\s*\n/gm, '') : '',
    user
});

const ChatRoom = (props: any) => {
    const { user }: any = useContext(AppContext);
    const { navigation } = props;
    const [messages = [], setMessages] = useState([]);
    const media = new MediaBuilder();
    const socket = media.socket();

    useEffect(() => {
        console.log('6. ChatRoom');
        media.msgFromServer(socket, getMessage, ['chat-messages']);
        media.msgFromServer(socket, setMessageList, ['moodem-chat']);
        media.msgToServer(socket, 'moodem-chat',
            { chatRoom: setChatRoomName(props.route.params.group), user });

        return () => {
            console.log('5. OFF EFFECT ChatRoom');
            socket.disconnect();
            socket.off(media.msgFromServer);
            socket.close();
        };
    }, [messages.length]);

    const getMessage = (msg: never) => {
        if (msg) {
            setMessages([msg, ...messages]);
            console.log('MESSSAGEssss', messages);
        }
    };

    const setMessageList = (messagesList: never[]) => {
        console.log('MESSAGES  LIST', messagesList);
        setMessages([...messagesList]);
    };

    const renderItem = ({ item }: any) => (
        <MessagesListItem msg={item} />
    );

    const sendNewMsg = (value: string) => {
        console.log('SENND NEW MSG', value);
        media.msgToServer(socket, 'chat-messages',
            { chatRoom: setChatRoomName(props.route.params.group), msg: buildMsg(value, user), user  });
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
        </View>
    );
};

ChatRoom.navigationOptions = ({ route }: any) =>
({
    unmountOnBlur: true,
    headerBackTitle: '',
    title: `${route.params.group.group_name} Chat`
});

ChatRoom.propTypes = {
    navigation: PropTypes.object
};

memo(ChatRoom);

export {
    ChatRoom
};
