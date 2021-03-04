import PropTypes from 'prop-types';
import React, { memo } from 'react';
import CommonFlatList from '../../common/functional-components/CommonFlatList';
import CommonFlatListItem from '../../common/functional-components/CommonFlatListItem';

const MessagesList = (props: any) => {
    const {
        messages
    } = props;

    function renderItem(message: any) {
        return (
            <CommonFlatListItem
                contentContainerStyle={{ position: 'relative' }}
                leftAvatar={{
                    title: message.user && message.user.displayName[0],
                    source: { uri: message.user && message.user.photoURL }
                }}
                avatarStyle={{ width: 30, height: 30, borderRadius: 5, borderColor: '#ddd', borderWidth: 1 }}
                topDivider={true}
                title={message.user && message.user.displayName}
                titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                subtitle={message.text}
                subtitleStyle={{ fontSize: 14, color: '#999', fontStyle: 'italic' }}
            />
        );
    }
    return (
        <CommonFlatList
            data={messages}
            extraData={messages}
            keyExtractor={item => String(item.id)}
            inverted
            action={({ item }) => renderItem(item)}
        />
    );
};

MessagesList.propTypes = {
    messages: PropTypes.any
};

export default memo(MessagesList);
