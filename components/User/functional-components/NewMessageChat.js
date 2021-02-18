/* eslint-disable max-len */
import React, { useState, useEffect, useContext, memo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { UserContext } from '../functional-components/UserContext';
import { CommonTextInput } from '../../common/functional-components/CommonTextInput';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { MessagesListItem } from '../functional-components/MessagesListItem';
import { AbstractMedia } from '../../common/functional-components/AbstractMedia';

const buildMsg = (value, user) => ({
    id: Object.keys(user || {}).length ? `${user.uid}_${Math.random(10000)}` : Math.random(10000),
    text: value ? value.replace(/^\s*\n/gm, '') : '',
    user
});

export const NewMessageChat = memo((props) => {
    const isFocused = useIsFocused();
    const { user, group } = useContext(UserContext);
    const { navigation, messagesList, chatRoom } = props;
    const [messages = [], setMessages] = useState([...messagesList]);
    const [demo = '', setDemo] = useState([]);
    const abstractMedia = new AbstractMedia(props);
    const mediaBuilder = abstractMedia.mediaBuilder;

    useEffect(() => {
        console.log('5. NewMessageChat', messages);
        mediaBuilder.msgFromServer(abstractMedia.socket, getMessage);
        mediaBuilder.msgToServer(abstractMedia.socket, 'chat-messages', { chatRoom, msg: null });

        return () => {
            console.log('4. OFF EFFECT NewMessageChat');
            //abstractMedia.destroy();
        };
    }, []);

    const getMessage = (msg) => {
        if (msg) {
            setMessages([msg, ...messages]);
            console.log('MESSSAGEssss', messages);
        }
    };

    const sendNewMsg = (value) => {
        console.log('SENND NEW MSG', value);
        abstractMedia.handleMediaActions('chat-messages', { chatRoom, msg: buildMsg(value, user), user: user || { displayName: 'Guest' } });
    };

    const renderItem = ({ item }) => (
        <MessagesListItem msg={item} />
    );


    return (
        <View style={{ flex: 1, height: 200, paddingBottom: 60 }}>
            <View style={{ position: 'absolute', bottom: 0, right: 0, left: 7, width: '96%', zIndex: 1 }}>
    <Text>HELLO: {messages[0]}</Text>
                <CommonTextInput navigation={navigation} user={user} callback={sendNewMsg} />
            </View>
            <CommonFlatList
                data={messages}
                extraData={messages}
                keyExtractor={item => String(item.id)}
                inverted
                action={renderItem}
            />
        </View>
    );
});
