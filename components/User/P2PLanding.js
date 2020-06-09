/* eslint-disable max-len */
import io from 'socket.io-client';
import Toast from 'react-native-easy-toast';
import React, { useEffect, useContext, memo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MainContainer } from '../common/MainContainer';
import { Songs } from '../User/functional-components/Songs';
import { Videos } from '../User/functional-components/Videos';
import { IP, socketConf } from '../../src/js/Utils/Helpers/services/socket';
import { UserContext } from '../User/functional-components/UserContext';

const welcomeMsgMoodem = (toastRef) => data => toastRef.show(data, 1000);

const P2PLanding = memo(() => {
    const { user } = useContext(UserContext);
    const socket = io(IP, socketConf);
    const toastRef = React.createRef();
    const Tab = createMaterialTopTabNavigator();

    useEffect(() => {
        console.log('Effect P2PLanding');
        socket.on('server-send-message-welcomeMsg', welcomeMsgMoodem(toastRef.current));
        socket.emit('server-send-message-welcomeMsg', { chatRoom: 'global-playList-moodem', displayName: user.displayName || 'Guest' });
        return () => {
            socket.off(welcomeMsgMoodem);
            socket.close();
        };
    }, []);

    return (
        <MainContainer>
            <Tab.Navigator>
                <Tab.Screen name="Songs" component={Songs} />
                <Tab.Screen name="Videos" component={Videos} />
            </Tab.Navigator>
            <Toast
                position='top'
                ref={toastRef}
            />
        </MainContainer>
    );
});

P2PLanding.navigationOptions = ({ route }) => ({
    headerShown: false,
    title: route.params.groupName
});

export {
    P2PLanding
};
