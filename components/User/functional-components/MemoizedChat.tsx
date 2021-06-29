import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import React, { memo, useEffect, useState } from 'react';
import { hasNotch } from 'react-native-device-info';
import { GiftedChat } from 'react-native-gifted-chat';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import AvatarChat from './AvatarChat';

const MemoizedChat = (props: any) => {
    const {
        disablePressAvatar,
        onPressAvatar,
        messages,
        user,
        onChangeTextBtn,
        sendMsgBtn,
        socket,
        chatRoom
    } = props;
    const [isTyping, setIsTyping] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        socket.on('user-typing', getUserTyping);
        if (!isFocused) {
            socket.emit('user-typing', {
                chatRoom,
                isTyping: false
            });
        }
        return () => {
            socket.off('user-typing', getUserTyping);
        };
    }, [isFocused]);

    function getUserTyping(data: any) {
        return setIsTyping(data.isTyping);
    }
    return (
        <GiftedChat
            onInputTextChanged={(text: string) => {
                if (text) {
                    return socket.emit('user-typing', {
                        chatRoom,
                        isTyping: true
                    });
                }
                return socket.emit('user-typing', {
                    chatRoom,
                    isTyping: false
                });
            }}
            isTyping={isTyping}
            bottomOffset={hasNotch() ? 30 : 0}
            maxComposerHeight={200}
            minInputToolbarHeight={40}
            maxInputLength={1000}
            locale={dayjs.locale('es')}
            wrapInSafeArea
            loadEarlier
            placeholder={translate('chat.placeHolderChatButton')}
            infiniteScroll
            renderUsernameOnMessage
            showAvatarForEveryMessage
            messages={messages}
            renderSend={(attrs) => onChangeTextBtn(attrs)}
            onSend={(msgs) => sendMsgBtn(msgs[0])}
            keyboardShouldPersistTaps='always'
            showUserAvatar
            inverted
            renderAvatar={({ currentMessage }) => <AvatarChat
                currentMessage={currentMessage}
                onPressAvatar={() => onPressAvatar(currentMessage)}
                disablePressAvatar={disablePressAvatar}
            />}
            user={{
                _id: user.uid,
                name: user.displayName,
                avatar: user.avatar
            }}
        />
    );
};

export default memo(MemoizedChat);
