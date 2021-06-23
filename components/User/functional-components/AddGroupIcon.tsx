import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

const AddGroupIcon = () => {
    const navigation = useNavigation();

    return (
        <Icon
            containerStyle={{
                position: 'absolute',
                zIndex: 10,
                bottom: 5,
                right: 5,
                width: 50
            }}
            Component={TouchableScale}
            name={'add-task'}
            type={'Entypo'}
            size={40}
            color='#1E90FF'
            onPress={() => {
                return navigation.navigate('CreateNewGroupScreen');
            }}
        />
    );
};

export default memo(AddGroupIcon);
