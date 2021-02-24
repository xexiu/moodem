import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';

const MessagesListItem = ({ msg }: any) => (
    <CommonFlatListItem
        contentContainerStyle={{ position: 'relative' }}
        leftAvatar={{
            title: msg.user && msg.user.displayName[0],
            source: { uri: msg.user && msg.user.photoURL }
        }}
        avatarStyle={{ width: 30, height: 30, borderRadius: 5, borderColor: '#ddd', borderWidth: 1 }}
        topDivider={true}
        title={msg.user && msg.user.displayName}
        titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
        subtitle={msg.text}
        subtitleStyle={{ fontSize: 14, color: '#999', fontStyle: 'italic' }}
    />
);

MessagesListItem.propTypes = {
    msg: PropTypes.any,
    contentContainerStyle: PropTypes.object,
    leftAvatar: PropTypes.object,
    title: PropTypes.string,
    titleProps: PropTypes.object,
    subtitle: PropTypes.string,
    subtitleStyle: PropTypes.string
};

memo(MessagesListItem);

export {
    MessagesListItem
};
