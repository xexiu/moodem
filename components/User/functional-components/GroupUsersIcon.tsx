import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

function checkLength(users: any) {
    if (users) {
        return users.length >= 100 ? '100+' : users.length;
    }
    return 0;
}

export const GroupUsersIcon = ({ users }: any) => {
    return (
        <View style={{ position: 'relative' }}>
            <Icon
                containerStyle={{
                    position: 'absolute',
                    bottom: 12,
                    left: 60,
                    width: 50
                }}
                disabled
                disabledStyle={{ backgroundColor: 'transparent' }}
                name={'supervised-user-circle'}
                type={'FontAwesome'}
                size={15}
                color='#ddd'
            />
            <Text style={{ position: 'absolute', left: 95, top: -27, fontSize: 12 }}>{checkLength(users)}</Text>
        </View>
    );
};
