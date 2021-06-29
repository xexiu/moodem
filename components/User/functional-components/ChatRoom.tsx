import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import FastImage from 'react-native-fast-image';
import { GiftedChat } from 'react-native-gifted-chat';
import { BodyContainer } from '../../common/functional-components/BodyContainer';
import BurgerMenuIcon from '../../common/functional-components/BurgerMenuIcon';
import PreLoader from '../../common/functional-components/PreLoader';
import { AppContext } from '../store-context/AppContext';
import HeaderChat from './HeaderChat';
import MemoizedChat from './MemoizedChat';
import SendBtnChat from './SendBtnChat';

const DEFAULT_AVATAR_STYLE = {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 5
};

const ChatRoom = (props: any) => {
    const { user, group, socket, isServerError }: any = useContext(AppContext);
    const { navigation } = props;
    const [allValues, setValues] = useState({
        messages: [],
        isLoading: true
    });
    const toastRef = useRef() as any;
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isServerError && isFocused) {
            socket.on('moodem-chat', setMessageList);
            socket.on('chat-messages', getMessage);
            socket.emit('moodem-chat',
                {
                    chatRoom: `ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}`
                });
        }

        return () => {
            socket.off('moodem-chat', setMessageList);
            socket.off('chat-messages', getMessage);
        };
    }, [isServerError, group, isFocused]);

    const setMessageList = (messagesList: never[]) => {
        // socket.off('moodem-chat', setMessageList);
        return setValues(prev => {
            return {
                ...prev,
                isLoading: false,
                messages: [...messagesList]
            };
        });
    };

    function getMessage(msg: any) {
        return setValues(prev => {
            return {
                ...prev,
                messages: GiftedChat.append(prev.messages, msg)
            };
        });
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

    const onPressAvatar = (currentMessage: any) => {
        return navigation.navigate('PrivateUserMessageScreen', {
            currentMessage
        });
    };

    const memoizedRenderSendBtn = useCallback((attrs: any) => {
        return (
            <SendBtnChat attrs={attrs} />
        );
    }, []);

    const memoizedOnSend = useCallback((message: any) => {
        socket.emit('chat-messages',
            {
                chatRoom: `ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}`,
                msg: {
                    text: message.text,
                    user: {
                        _id: message.user._id,
                        name: message.user.name,
                        avatar: user.photoURL || '',
                        user_id: user.uid
                    },
                    createdAt: message.createdAt,
                    _id: message._id
                }
            });
    }, []);

    const renderLoading = useCallback(() => {
        return (
            <BodyContainer>
                <BurgerMenuIcon
                    action={navigation.openDrawer}
                />
                <PreLoader
                    containerStyle={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    size={50}
                />
                <Toast
                    position={'top'}
                    ref={toastRef}
                />
            </BodyContainer>
        );
    }, [isServerError]);

    const showErrMsg = useCallback(() => {
        setTimeout(() => {
            if (toastRef.current) {
                clearTimeout();
                toastRef.current.show('Connecting to server...', DURATION.FOREVER);
            }
        }, 1000);

    }, [isServerError]);

    if (allValues.isLoading || isServerError) {
        return (
            <View style={{ flex: 1 }}>
                { renderLoading()}
                { isServerError && showErrMsg()}
            </View>
        );
    }

    console.log('ChatRoom');

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => {
                    navigation.openDrawer();
                    Keyboard.dismiss();
                }}
            />
            <HeaderChat
                group={group}
            />
            <MemoizedChat
                chatRoom={`ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}`}
                socket={socket}
                renderAvatar={renderAvatar}
                messages={allValues.messages}
                user={user}
                memoizedRenderSendBtn={memoizedRenderSendBtn}
                memoizedOnSend={memoizedOnSend}
            />
        </BodyContainer>
    );
};

ChatRoom.propTypes = {
    navigation: PropTypes.object
};

export default memo(ChatRoom);
