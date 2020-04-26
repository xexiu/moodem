import React from 'react';
import { Icon } from 'react-native-elements';
import { logoutIcon } from '../../../src/css/styles/logout';

export const Logout = (props) => {
    const {
        action
    } = props;

    return (
        <Icon
            iconStyle={logoutIcon}
            name='exit-to-app'
            type='material-icons'
            color='#dd0031'
            size={25}
            onPress={action}
        />
    );
};
