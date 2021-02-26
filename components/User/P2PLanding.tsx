/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useContext, useEffect, useRef } from 'react';
import Toast from 'react-native-easy-toast';
import { AbstractMedia } from '../common/functional-components/AbstractMedia';
import { BodyContainer } from '../common/functional-components/BodyContainer';
import { MainContainer } from '../common/MainContainer';
import { Songs } from '../User/functional-components/Songs';
import { AppContext } from './functional-components/AppContext';

const welcomeMsgMoodem = (toastRef: any) => (data: any) => toastRef.show(data, 3000);

const P2PLanding = (props: any) => {
    const { group }: any = useContext(AppContext);
    const isFocused = useIsFocused();
    const toastRef = useRef(null);
    const media = new AbstractMedia();

    useEffect(() => {
        console.log('3. ON P2PLanding', isFocused);
        if (isFocused) {
            media.on('server-send-message-welcomeMsg', welcomeMsgMoodem(toastRef.current));
            media.emit('server-send-message-welcomeMsg', { chatRoom: group.group_name });
        }

        return () => {
            console.log('3. OFF P2PLanding');
            media.destroy();
        };
    }, [isFocused]);

    return (
        <MainContainer>
            <BodyContainer>
                <Songs {...props} />
                <Toast
                    position='top'
                    ref={toastRef}
                />
            </BodyContainer>
        </MainContainer>
    );
};

memo(P2PLanding);

export {
    P2PLanding
};
