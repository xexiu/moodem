import React from 'react';
import { View, Text } from 'react-native';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';

const ChatRoom = () => (
    <View>
        <Text>General Chat Room</Text>
        <Text>General Chat Room</Text>
        <Text>General Chat Room</Text>
        <Text>General Chat Room</Text>
        <Text>General Chat Room</Text>
    </View>
);

ChatRoom.navigationOptions = ({ navigation, route }) => ({
    headerMode: 'none',
    headerShown: false,
    title: getGroupName(route.params.groupName, 'Chat Room')
});

export {
    ChatRoom
};
