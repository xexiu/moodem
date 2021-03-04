import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { View } from 'react-native';
import { bodyContainer } from '../../../src/css/styles/bodyContainer';

type Props = {
    children: React.ReactNode;
};

const BodyContainer = (props: Props) => {
    return (
        <View style={bodyContainer}>
            {props.children}
        </View>
    );
};

BodyContainer.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

export default memo(BodyContainer);
