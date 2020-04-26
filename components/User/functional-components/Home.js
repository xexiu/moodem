import React from 'react';
import { Icon } from 'react-native-elements';
import { homeIcon } from '../../../src/css/styles/home';

export const Home = (props) => {
    const {
        action
    } = props;
    return (
        <Icon
            iconStyle={homeIcon}
            name='home'
            type='antdesign'
            color='#dd0031'
            size={25}
            onPress={action}
        />
    );
};
