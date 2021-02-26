/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { View } from 'react-native';

const HeaderChat = (props: any) => {
    return (
        <View
            style={{
                marginTop: 35,
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                paddingBottom: 10
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

memo(HeaderChat);

export {
    HeaderChat
};
