import React from 'react';
import { CommonActions } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { homeIcon } from '../../../src/css/styles/home';

const handlerGoHome = (props) => {
    Object.assign(props.group, {
        group_name: 'Moodem'
    });
    props.navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [
                {
                    name: 'Moodem',
                    params: {
                        group: {
                            group_name: 'Moodem',
                            group_id: null
                        }
                    },
                }
            ],
        })
    );
};

export const Home = (props) => (
    <Icon
        iconStyle={homeIcon}
        name='home'
        type='antdesign'
        color='#dd0031'
        size={25}
        onPress={() => handlerGoHome(props)}
    />
);
