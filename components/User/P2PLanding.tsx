/* eslint-disable max-len */
import React, { memo, useContext, useEffect, useRef } from 'react';
import Toast from 'react-native-easy-toast';
import io from 'socket.io-client';
import { getGroupName } from '../../src/js/Utils/Helpers/actions/groups';
import { IP, socketConf } from '../../src/js/Utils/Helpers/services/socket';
import { MainContainer } from '../common/MainContainer';
import { Songs } from '../User/functional-components/Songs';
import { UserContext } from '../User/functional-components/UserContext';

const welcomeMsgMoodem = (toastRef: any) => (data: any) => toastRef.show(data, 3000);

function setChatRoomName(group: any) {
    if (group.group_name && group.group_id) {
        return `${group.group_name}-${group.group_id}`;
    }
    return 'Moodem';
}

function getUserUidAndName(user: any) {
    let guid = Number(Math.random() * 36);

    if (user) {
        return `uid=${user.uid}&displayName=${user.displayName}`;
    }

    return `uid=${Date.now().toString(36) + (guid++ % 36).toString(36) + Math.random().toString(36).slice(2, 4)}&displayName=Guest`;
}

const P2PLanding = (props: any) => {
    const { user }: any = useContext(UserContext);
    const socket = io(IP, { ...socketConf, query: getUserUidAndName(user) });
    const toastRef = useRef(null);

    useEffect(() => {
        console.log('3. P2PLanding');
        socket.on('server-send-message-welcomeMsg', welcomeMsgMoodem(toastRef.current));
        socket.emit('server-send-message-welcomeMsg', { chatRoom: setChatRoomName(props.route.params.group) });

        return () => {
            socket.disconnect();
            socket.off('server-send-message-welcomeMsg', welcomeMsgMoodem);
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
};

P2PLanding.navigationOptions = ({ route }: any) =>
({
    headerShown: false,
    title: getGroupName(route.params.group.group_name, 'Moodem')
});

memo(P2PLanding);

export {
    P2PLanding
};
