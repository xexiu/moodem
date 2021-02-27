import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { AbstractMedia } from '../../common/functional-components/AbstractMedia';
import { BodyContainer } from '../../common/functional-components/BodyContainer';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonTextInput } from '../../common/functional-components/CommonTextInput';
import { AppContext } from '../functional-components/AppContext';
import { HeaderChat } from '../functional-components/HeaderChat';
import { HeaderChatTitle } from '../functional-components/HeaderChatTitle';
import { HeaderChatUsers } from '../functional-components/HeaderChatUsers';
import { MessagesListItem } from '../functional-components/MessagesListItem';

const buildMsg = (value: string, user: any) => ({
    id: Object.keys(user || {}).length ? `${user.uid}_${Math.random()}` : Math.random(),
    text: value ? value.replace(/^\s*\n/gm, '') : '',
    user
});

const ChatRoom = (props: any) => {
    const { user, group }: any = useContext(AppContext);
    const isFocused = useIsFocused();
    const { navigation } = props;
    const [messages = [], setMessages] = useState([]);
    const media = new AbstractMedia();

    useEffect(() => {
        console.log('5. ChatRoom');
        media.on('chat-messages', getMessage);
        media.on('moodem-chat', setMessageList);
        media.emit('moodem-chat',
            { chatRoom: `${group.group_name}-ChatRoom-${group.group_id}`, user });

        return () => {
            console.log('5. OFF EFFECT ChatRoom');
            media.destroy();
        };
    }, [messages.length, isFocused, group]);

    const getMessage = (msg: never) => {
        if (msg) {
            setMessages([msg, ...messages]);
        }
    };

    const setMessageList = (messagesList: never[]) => {
        setMessages([...messagesList]);
    };

    const renderItem = ({ item }: any) => (
        <MessagesListItem msg={item} />
    );

    const sendNewMsg = (value: string) => {
        media.emit('chat-messages',
            { chatRoom: `${group.group_name}-ChatRoom-${group.group_id}`, msg: buildMsg(value, user), user });
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
                <HeaderChatUsers chatRoom={`${group.group_name}-ChatRoom-${group.group_id}`} />
            </HeaderChat>
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
        </BodyContainer>
    );
};

ChatRoom.propTypes = {
    navigation: PropTypes.object
};

memo(ChatRoom);

export {
    ChatRoom
};
