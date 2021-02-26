/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { View } from 'react-native';

type Props = {
    children: React.ReactNode;
};

const MainContainer = (props: Props) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff', position: 'relative' }}>
            {props.children}
        </View>
    );
};

MainContainer.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

memo(MainContainer);

export {
    MainContainer
};
