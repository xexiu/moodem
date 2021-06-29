import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import React, { memo, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { GiftedChat } from 'react-native-gifted-chat';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';

const DEFAULT_AVATAR_STYLE = {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 5
};

const MemoizedChat = (props: any) => {
    const {
        onPressAvatar,
        messages,
        user,
        memoizedRenderSendBtn,
        memoizedOnSend,
        socket,
        group
    } = props;
    const [isTyping, setIsTyping] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        socket.on('user-typing', getUserTyping);
        if (!isFocused) {
            socket.emit('user-typing', {
                chatRoom: `ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}`,
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

    function renderAvatar({ currentMessage }: any) {
        return (
            <TouchableOpacity
                onPress={() => onPressAvatar(currentMessage)}
                disabled={currentMessage.user._id === user.uid}
            >
                <FastImage
                    style={DEFAULT_AVATAR_STYLE}
                    source={{
                        uri: currentMessage.user.avatar,
                        priority: FastImage.priority.high
                    }}
                />
            </TouchableOpacity>
        );
    }

    return (
        <GiftedChat
            onInputTextChanged={(text: string) => {
                if (text) {
                    return socket.emit('user-typing', {
                        chatRoom: `ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}`,
                        isTyping: true
                    });
                }
                return socket.emit('user-typing', {
                    chatRoom: `ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}`,
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
            renderSend={(attrs) => memoizedRenderSendBtn(attrs)}
            onSend={(msgs) => memoizedOnSend(msgs[0])}
            keyboardShouldPersistTaps='always'
            showUserAvatar
            inverted
            renderAvatar={renderAvatar}
            user={{
                _id: user.uid,
                name: user.displayName,
                avatar: user.avatar
            }}
        />
    );
};

export default memo(MemoizedChat);
