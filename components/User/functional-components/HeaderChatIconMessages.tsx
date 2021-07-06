import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

const HeaderChatIconMessages = () => {
    const navigation = useNavigation();

    return (
        <Icon
            containerStyle={{
                position: 'absolute',
                zIndex: 10,
                top: 5,
                right: 0,
                width: 50
            }}
            Component={TouchableScale}
            name={'inbox'} // move-to-inbox when not read message
            type={'Entypo'}
            size={25}
            color='#1E90FF'
            onPress={() => {
                return navigation.navigate('PrivateMessagesScreen');
            }}
        />
    );
};

export default memo(HeaderChatIconMessages);
