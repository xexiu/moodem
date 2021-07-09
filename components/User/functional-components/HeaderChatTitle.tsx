import React, { memo } from 'react';
import { Text } from 'react-native';

const HeaderChatTitle = (props: any) => {
    const {
        group
    } = props;
    return (
        <Text>{`${group.group_name}`}</Text>
    );
};

export default memo(HeaderChatTitle);
