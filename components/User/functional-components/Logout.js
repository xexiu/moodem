import React from 'react';
import { Icon } from 'react-native-elements';
import { logoutIcon } from '../../../src/css/styles/logout';
import firebase from '../../../src/js/Utils/Helpers/services/firebase';

const handleLogOut = (navigation) => {
    firebase.auth().signOut().then(() => {
        navigation.navigate('Guest', {
            params: {
                user: '',
                group: { group_name: 'Moodem' }
            }
        });
    });
};

export const Logout = (props) => {
    const {
        navigation
    } = props;

    return (
        <Icon
            iconStyle={logoutIcon}
            name='exit-to-app'
            type='material-icons'
            color='#dd0031'
            size={25}
            onPress={() => handleLogOut(navigation)}
        />
    );
};

