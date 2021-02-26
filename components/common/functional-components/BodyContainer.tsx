import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { View } from 'react-native';

type Props = {
    children: React.ReactNode;
};

const BodyContainer = (props: Props) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 30 }}>
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

memo(BodyContainer);

export {
    BodyContainer
};
