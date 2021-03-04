/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { View } from 'react-native';

const HeaderChat = (props: any) => {
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#eee'
            }}
        >
            {props.children}
        </View>
    );
};

HeaderChat.propTypes = {
    props: PropTypes.any,
    chatRoom: PropTypes.string
};

export default memo(HeaderChat);
