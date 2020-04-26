/* eslint-disable max-len, global-require */
import React from 'react';
import { View, Text } from 'react-native';
import { CreateGroup } from '../../../components/User/class-components/CreateGroup';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';

const Groups = (props) => {
    const handleGroupName = props.route.params.handleGroupName;

    return (
        <View style={{ alignItems: 'center', marginTop: 100 }}>
            {props.route.params.user ?
                <CreateGroup handleGroupName={handleGroupName} navigation={props.navigation} /> :
                props.navigation.navigate('Guest')
            }
            <Text>My Groups</Text>
        </View>
    );
};

Groups.navigationOptions = ({ navigation, route }) => ({
    headerMode: 'none',
    headerShown: false,
    title: getGroupName(route.params.groupName, 'Groups')
});

export {
    Groups
};

