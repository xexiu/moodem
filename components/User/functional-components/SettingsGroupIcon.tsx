import { useNavigation } from '@react-navigation/native';
import React from 'react';
import Button from '../../../components/User/functional-components/Button';

export const SettingsGroupIcon = ({ group }: any) => {
    const navigation = useNavigation<any>();

    return (
        <Button
            action={() => {
                return navigation.navigate('GroupSettingsScreen', {
                    group
                });
            }}
            containerStyle={{ marginTop: 10 }}
            textStyle={{ fontSize: 12, paddingLeft: 5, paddingRight: 10, marginTop: 10 }}
            iconReverse={false}
            iconName={'settings'}
            iconType={'FontAwesome'}
            iconColor='#1E90FF'
            iconSize={15}
        />
    );
};