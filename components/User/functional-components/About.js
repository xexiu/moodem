/* eslint-disable max-len */
import React from 'react';
import { Icon } from 'react-native-elements';

export const About = (props) => {
    const {
        navigation
    } = props;

    return (
        <Icon
            iconStyle={{ alignSelf: 'flex-end', marginTop: -30, marginRight: 65 }}
            name='infocirlceo'
            type='antdesign'
            color='#000'
            size={24}
            onPress={() => navigation.navigate('About')}
        />
    );
};
