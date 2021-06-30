import React, { memo, useContext, useEffect, useRef } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';
import { BodyContainer } from '../../common/functional-components/BodyContainer';
import PreLoader from '../../common/functional-components/PreLoader';
import { AppContext } from '../store-context/AppContext';

const ChatLoading = () => {
    const { isServerError }: any = useContext(AppContext);
    const toastRef = useRef() as any;

    useEffect(() => {
        if (isServerError) {
            toastRef.current.show('Connecting to server...', DURATION.FOREVER);
        }
    }, [isServerError]);

    return (
        <BodyContainer>
            <PreLoader
                containerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                size={50}
            />
            <Toast
                position={'top'}
                ref={toastRef}
            />
        </BodyContainer>
    );
};

export default memo(ChatLoading);
