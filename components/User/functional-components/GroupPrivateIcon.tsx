import React from 'react';
import Button from '../../../components/User/functional-components/Button';

export const GroupPrivateIcon = ({ group }: any) => {
    return (
        <Button
            containerStyle={{ marginTop: 10 }}
            disabled
            disabledStyle={{ backgroundColor: 'transparent', color: '#000' }}
            iconReverse={false}
            iconName={group.group_password ? 'lock' : 'lock-open' }
            iconType={'FontAwesome'}
            iconColorDisabled={'#000'}
            iconSize={15}
        />
    );
};
