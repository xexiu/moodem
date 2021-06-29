import React, { memo, useContext, useEffect, useRef } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';
import { BodyContainer }  from '../../../components/common/functional-components/BodyContainer';
import { AppContext } from '../../../components/User/store-context/AppContext';

const PrivateUserMessageScreen = (props: any) => {
    const { currentMessage } = props.route.params;
    const { navigation } = props;
    const { user }: any = useContext(AppContext);
    const toastRef = useRef() as any;

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true,
            title: `${currentMessage.user.name}`
        });
        toastRef.current.show('Próximamente...', DURATION.FOREVER);
    }, []);

    return (
        <BodyContainer>
            <Toast
                position={'top'}
                ref={toastRef}
            />
        </BodyContainer>
    );
};

export default memo(PrivateUserMessageScreen);
