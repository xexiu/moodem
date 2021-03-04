import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Text } from 'react-native';

const HeaderChatTitle = (props: any) => {
    const {
        group
    } = props;
    return (
        <Text>{`${group.group_name} Chat`}</Text>
    );
};

HeaderChatTitle.propTypes = {
    props: PropTypes.any,
    group: PropTypes.any
};

export default memo(HeaderChatTitle);
