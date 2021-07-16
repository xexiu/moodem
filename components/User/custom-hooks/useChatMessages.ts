import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { isEmulator } from 'react-native-device-info';
import { GiftedChat } from 'react-native-gifted-chat';
import PushNotification from 'react-native-push-notification';
import NotificationsService from '../../../NotificationsService';

import { AppContext } from '../store-context/AppContext';

function useChatMessages(chatRoom: string | any, navigationOptions?: any, onRegister?: any, onNotification?: any) {
    const { socket, isServerError }: any = useContext(AppContext);
    const [allValues, setValues] = useState({
        messages: [],
        connectedUsers: 0,
        isLoading: true,
        deviceConfig: null,
        notificationClicked: null
    });
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const notifications = new NotificationsService(
        onRegister || _onRegister,
        onNotification || _onNotification
    );

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
                PushNotification.unregister();
                PushNotification.cancelAllLocalNotifications();
                PushNotification.clearAllNotifications();
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
    }, [isFocused, isServerError]);

    function _onRegister(deviceConfig: any) {
        notifications.checkPermission((data: any) => {
            if (data) {
                Object.assign(deviceConfig, {
                    hasPushPermissions: data.authorizationStatus > 1 ? true : false
                });
            }
            setValues(prev => {
                return {
                    ...prev,
                    deviceConfig,
                    isLoading: false
                };
            });
        });
    }

    function _onNotification(notif: any) {
        return setValues(prev => {
            return {
                ...prev,
                notificationClicked: notif
            };
        });
    }

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

    async function getMessageList(messagesList: never[]) {
        const _isEmulator = await isEmulator();

        return setValues(prev => {
            return {
                ...prev,
                isLoading: _isEmulator ? false : true,
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

    return {
        isLoading: allValues.isLoading,
        messages: allValues.messages,
        connectedUsers: allValues.connectedUsers,
        deviceConfig: allValues.deviceConfig,
        notificationClicked: allValues.notificationClicked
    };
}

export default useChatMessages;
