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

memo(MainContainer);

export {
    MainContainer
};
