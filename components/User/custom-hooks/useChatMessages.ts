import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { AppContext } from '../store-context/AppContext';

function useChatMessages(chatRoom: string | any, navigationOptions?: any) {
    const { socket, isServerError }: any = useContext(AppContext);
    const [allValues, setValues] = useState({
        messages: [],
        connectedUsers: 0,
        isLoading: true
    });
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    useEffect(() => {
        if (navigationOptions) {
            navigation.setOptions(navigationOptions);
        }

        if (!isServerError && isFocused) {
            // Emit
            AppState.addEventListener('change', getInactiveUsers);
            socket.emit('moodem-chat-join', { chatRoom });
            socket.emit('get-chat-messages', { chatRoom });
            socket.emit('get-connected-users', { chatRoom });

            // Set
            socket.on('set-chat-messages', getMessageList);
            socket.on('set-chat-message', getMessage);
            socket.on('users-connected-to-room', setConnectedUsers);
        }
        return () => {
            if (isFocused) {
                socket.off('set-chat-messages', getMessageList);
                socket.off('set-chat-message', getMessage);
                socket.off('users-connected-to-room', setConnectedUsers);
                socket.off('get-chat-messages', { chatRoom });
                socket.off('get-chat-message', { chatRoom });
                socket.emit('moodem-chat-leave', { chatRoom });
                socket.emit('get-connected-users', { leaveChatRoom: chatRoom, chatRoom });
                AppState.removeEventListener('change', getInactiveUsers);
            }
        };
    }, [isFocused]);

    function getInactiveUsers(data: any) {
        if (data !== 'active') {
            socket.open();
            socket.emit('get-connected-users', { leaveChatRoom: chatRoom, chatRoom });
        } else {
            socket.open();
            socket.emit('get-connected-users', { chatRoom });
        }
    }

    function setConnectedUsers(data: any) {
        return setValues(prev => {
            return {
                ...prev,
                connectedUsers: data
            };
        });
    }

    function getMessageList(messagesList: never[]) {
        return setValues(prev => {
            return {
                ...prev,
                isLoading: false,
                messages: [...messagesList]
            };
        });
    }

    function getMessage(_msg: any) {
        return setValues(prev => {
            return {
                ...prev,
                messages: GiftedChat.append(prev.messages, _msg)
            };
        });
    }

    return { isLoading: allValues.isLoading, messages: allValues.messages, connectedUsers: allValues.connectedUsers };
}

export default useChatMessages;
