import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { View } from 'react-native';
import { bodyContainer } from '../../../src/css/styles/bodyContainer';

const BodyContainer = (props: any) => {
    const {
        customBodyContainerStyle
    } = props;

    return (
        <View style={[bodyContainer, customBodyContainerStyle]}>
            {props.children}
        </View>
    );
};

BodyContainer.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired,
    customBodyContainerStyle: PropTypes.object
};

export default memo(BodyContainer);
