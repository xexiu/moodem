import React from 'react';
import Button from '../../../components/User/functional-components/Button';

function checkLength(users: any) {
    if (users) {
        return users.length >= 100 ? '100+' : users.length;
    }
    return 0;
}

export const GroupUsersIcon = ({ users }: any) => {
    return (
        <Button
            containerStyle={{ marginTop: 10}}
            textStyle={{ fontSize: 12, paddingLeft: 5, paddingRight: 10, marginTop: 10 }}
            disabled
            disabledStyle={{ backgroundColor: 'transparent' }}
            iconReverse={false}
            iconName={'supervised-user-circle'}
            iconType={'FontAwesome'}
            iconColor='#ddd'
            iconSize={15}
            text={checkLength(users)}
        />
    );
};
