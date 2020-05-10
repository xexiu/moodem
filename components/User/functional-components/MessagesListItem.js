import React, { memo } from 'react';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';

export const MessagesListItem = memo(({ msg }) => (
    <CommonFlatListItem
        disabled
        contentContainerStyle={{ position: 'relative' }}
        leftAvatar={{
            title: msg.user && msg.user.displayName[0],
            source: { uri: msg.user && msg.user.photoURL }
        }}
        title={msg.user && msg.user.displayName}
        titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
        subtitle={msg.text}
        subtitleStyle={{ fontSize: 14, color: '#999', fontStyle: 'italic' }}
    />
));
