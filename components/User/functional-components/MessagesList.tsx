import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Keyboard, Text, View } from 'react-native';
import CommonFlatList from '../../common/functional-components/CommonFlatList';
import CommonFlatListItem from '../../common/functional-components/CommonFlatListItem';

const MessagesList = (props: any) => {
    const {
        messages
    } = props;

    const setUserTitle = (message: any) => {
        return message.user && message.user.displayName;
    };

    const createdAt = () => {
        return (
            <View style={{ flex: 1, alignSelf: 'flex-end', position: 'absolute', top: -12 }}>
                <Text
                    style={{
                        color: '#777',
                        fontSize: 12,
                        fontStyle: 'italic'
                    }}
                    numberOfLines={1}
                >
                    {new Date().toLocaleTimeString()}
                </Text>
            </View>
        );
    };

    const renderItem = (message: any) => (
        <CommonFlatListItem
            contentContainerStyle={{ position: 'relative' }}
            leftAvatar={{
                title: message.user && message.user.displayName[0],
                source: { uri: message.user && message.user.photoURL }
            }}
            avatarStyle={{ width: 30, height: 30, borderRadius: 5, borderColor: '#ddd', borderWidth: 1 }}
            topDivider={true}
            title={setUserTitle(message)}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={message.text}
            subtitleStyle={{ fontSize: 14, color: '#999', fontStyle: 'italic' }}
            action={Keyboard.dismiss}
        />
    );
    return (
        <CommonFlatList
            data={messages}
            keyExtractor={item => String(item.id)}
            inverted
            action={({ item }) => {
                console.log('Render');
                return renderItem(item);
            }}
        />
    );
};

MessagesList.propTypes = {
    messages: PropTypes.any
};

export default memo(MessagesList);
