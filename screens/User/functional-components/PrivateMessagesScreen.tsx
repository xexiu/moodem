import { useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import CommonFlatList from '../../../components/common/functional-components/CommonFlatList';
import CommonFlatListItem from '../../../components/common/functional-components/CommonFlatListItem';
import ChatLoading from '../../../components/User/functional-components/ChatLoading';
import { MediaListEmpty } from '../../../components/User/functional-components/MediaListEmpty';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { USER_AVATAR_DEFAULT } from '../../../src/js/Utils/constants/users';

const PrivateMessagesScreen = (props: any) => {
    const { user, group, socket, isServerError }: any = useContext(AppContext);
    const [allValues, setValues] = useState({
        messages: [],
        isLoading: true
    });
    const { navigation } = props;
    const chatRoom = `ChatRoom-GroupId_${group.group_id}_GroupName_${group.group_name}_${user.uid}--with--`;
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true,
            title: 'Mensajes Privados'
        });

        if (!isServerError && isFocused) {
            // Emit
            socket.emit('get-private-messages', { chatRoom, uid: user.uid });

            // Set
            socket.on('set-private-messages', setPrivateMessages);
        }

        return () => {
            if (isFocused) {
                socket.off('set-private-messages', setPrivateMessages);
                socket.off('get-private-messages', { uid: user.uid });
            }
        };
    }, [isFocused]);

    const keyExtractor = useCallback((item: any) => item._id, []);
    const memoizedItem = useCallback(({ item }) => (
        <CommonFlatListItem
            bottomDivider
            title={item.user.name}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            leftAvatar={{
                source: {
                    uri: item.user.vatar || USER_AVATAR_DEFAULT
                }
            }}
            action={() => navigation.navigate('PrivateUserMessageScreen', {
                currentMessage: item
            })}
        />
    ), []);

    function setPrivateMessages(userPrivateMessages: any) {
        const uniQueMessages = userPrivateMessages.filter((msg: any, index: number, self: any) =>
            index === self.findIndex((_msg: any) => msg.user._id === _msg.user._id && msg.user._id !== user.uid)
        );
        return setValues(prev => {
            return {
                ...prev,
                isLoading: false,
                messages: [...uniQueMessages]
            };
        });
    }

    if (allValues.isLoading || isServerError) {
        return (
            <ChatLoading />
        );
    }

    return (
        <BodyContainer>
            <CommonFlatList
                style={{ marginTop: 10 }}
                emptyListComponent={<MediaListEmpty />}
                data={allValues.messages}
                action={memoizedItem}
                keyExtractor={keyExtractor}
            />
        </BodyContainer>
    );
};

export default memo(PrivateMessagesScreen);
