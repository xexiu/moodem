/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { SafeAreaView } from 'react-native';
import { mainContainer } from '../../../src/css/styles/mainContainer';

type Props = {
    children: React.ReactNode;
};

const MainContainer = (props: Props) => {
    return (
        <SafeAreaView style={mainContainer}>
            {props.children}
        </SafeAreaView>
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
