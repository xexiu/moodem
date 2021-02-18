/* eslint-disable max-len */
import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

export const About = (props) => {
    const {
        navigation
    } = props;

    return (
        <View style={{ position: 'absolute', right: 65, width: 30, top: 0, height: 40 }}>
            <Icon
                iconStyle={{ alignSelf: 'flex-end', position: 'relative', marginTop: 5 }}
                name='infocirlceo'
                type='antdesign'
                color='#000'
                size={24}
                onPress={() => navigation.navigate('About')}
            />
        </View>
    );
};
