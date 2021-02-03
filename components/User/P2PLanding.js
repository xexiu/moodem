/* eslint-disable max-len */
import io from 'socket.io-client';
import Toast from 'react-native-easy-toast';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useContext, memo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MainContainer } from '../common/MainContainer';
import { Songs } from '../User/functional-components/Songs';
import { IP, socketConf } from '../../src/js/Utils/Helpers/services/socket';
import { UserContext } from '../User/functional-components/UserContext';
import { getGroupName } from '../../src/js/Utils/Helpers/actions/groups';


const welcomeMsgMoodem = (toastRef) => data => toastRef.show(data, 3000);

function setChatRoomName(group) {
    if (group.group_name && group.group_id) {
        return `${group.group_name}-${group.group_id}`;
    }
    return 'Moodem';
}

const P2PLanding = memo((props) => {
    const isFocused = useIsFocused();
    const { user, group } = useContext(UserContext);
    const socket = io(IP, socketConf);
    const toastRef = useRef(null);

    useEffect(() => {
        console.log('3. P2PLanding');
        socket.on('server-send-message-welcomeMsg', welcomeMsgMoodem(toastRef.current));
        socket.emit('server-send-message-welcomeMsg', { chatRoom: setChatRoomName(props.route.params.group), displayName: user.displayName || 'Guest' });

        return () => {
            socket.disconnect();
            socket.off(welcomeMsgMoodem);
            socket.close();
        };
    }, []);

    return (
        <MainContainer>
            <Songs {...props} />
            <Toast
                position='top'
                ref={toastRef}
            />
        </MainContainer>
    );
});

P2PLanding.navigationOptions = ({ route }) => {
    console.log('P2PLanding Navigation Options', route);
    return {
        headerShown: false,
        title: getGroupName(route.params.group.group_name, 'Moodem')
    };
};

export {
    P2PLanding
};
