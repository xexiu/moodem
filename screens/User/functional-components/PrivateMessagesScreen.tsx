import React, { memo, useCallback, useContext, useEffect } from 'react';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import CommonFlatList from '../../../components/common/functional-components/CommonFlatList';
import CommonFlatListItem from '../../../components/common/functional-components/CommonFlatListItem';
import { MediaListEmpty } from '../../../components/User/functional-components/MediaListEmpty';
import { AppContext } from '../../../components/User/store-context/AppContext';

const PrivateMessagesScreen = (props: any) => {
    const { user, socket }: any = useContext(AppContext);
    const { navigation } = props;

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true,
            title: 'Mensajes Privados'
        });
        socket.on('get-private-messages', getPrivateMessage);
        socket.emit('get-private-messages', { uid: user.uid });
    }, []);

    function getPrivateMessage(data: any) {

    }

    const keyExtractor = useCallback((item: any) => item.group_id, []);

    return (
        <BodyContainer>
            <CommonFlatList
                style={{ marginTop: 10 }}
                emptyListComponent={<MediaListEmpty />}
                data={[]}
                action={() => {}}
                keyExtractor={keyExtractor}
            />
        </BodyContainer>
    );
};

export default memo(PrivateMessagesScreen);
