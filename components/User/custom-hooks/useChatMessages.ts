import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { AppContext } from '../store-context/AppContext';

function useChatMessages(chatRoom: string | any, navigationOptions?: any) {
    const { group, socket, isServerError }: any = useContext(AppContext);
    const [allValues, setValues] = useState({
        messages: [],
        isLoading: true
    });
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    useEffect(() => {
        if (navigationOptions) {
            navigation.setOptions(navigationOptions);
        }
        if (!isServerError) {
            socket.on('moodem-chat', setMessageList);
            socket.on('chat-messages', getMessage);
            socket.emit('moodem-chat', { chatRoom });
        }
        return () => {
            socket.off('moodem-chat', setMessageList);
            socket.off('chat-messages', getMessage);
        };
    }, [isServerError, chatRoom]);

    const setMessageList = (messagesList: never[]) => {
        return setValues(prev => {
            return {
                ...prev,
                isLoading: false,
                messages: [...messagesList]
            };
        });
    };

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
