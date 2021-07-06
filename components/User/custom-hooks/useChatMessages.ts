import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { AppContext } from '../store-context/AppContext';

function useChatMessages(chatRoom: string) {
    const { socket, isServerError }: any = useContext(AppContext);
    const [allValues, setValues] = useState({
        messages: [],
        isLoading: true
    });
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isServerError && isFocused) {
            // Emit
            socket.emit('moodem-chat-join', { chatRoom });
            socket.emit('get-chat-messages', { chatRoom });

            // Set
            socket.on('set-chat-messages', getMessageList);
            socket.on('set-chat-message', getMessage);
        }
        return () => {
            if (isFocused) {
                socket.off('set-chat-messages', getMessageList);
                socket.off('set-chat-message', getMessage);
                socket.off('get-chat-messages', { chatRoom });
                socket.off('get-chat-message', { chatRoom });
                socket.emit('moodem-chat-leave', { chatRoom });
            }
        };
    }, [isFocused]);

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

    return { isLoading: allValues.isLoading, messages: allValues.messages };
}

export default useChatMessages;
