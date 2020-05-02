import React, { useContext } from 'react';
import { Icon } from 'react-native-elements';
import { homeIcon } from '../../../src/css/styles/home';
import { UserContext } from './UserContext';

const handlerGoHome = (navigation, group) => {
    Object.assign(group, {
        ...group,
        group_name: 'Moodem'
    });

    navigation.navigate('Moodem');
};

export const Home = (props) => {
    const {
        navigation
    } = props;
    const { group } = useContext(UserContext);

    return (
        <Icon
            iconStyle={homeIcon}
            name='home'
            type='antdesign'
            color='#dd0031'
            size={25}
            onPress={() => handlerGoHome(navigation, group)}
        />
    );
};
