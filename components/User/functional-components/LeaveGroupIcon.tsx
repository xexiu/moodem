import React from 'react';
import Button from '../../../components/User/functional-components/Button';

export const LeaveGroupIcon = ({ group }: any) => {
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
        />
    );
};
