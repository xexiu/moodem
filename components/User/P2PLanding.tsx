/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import { BurgerMenuIcon } from '../common/BurgerMenuIcon';
import { AbstractMedia } from '../common/functional-components/AbstractMedia';
import { BgImage } from '../common/functional-components/BgImage';
import { BodyContainer } from '../common/functional-components/BodyContainer';
import { PreLoader } from '../common/functional-components/PreLoader';
import { Songs } from '../User/functional-components/Songs';
import { AppContext } from './functional-components/AppContext';

const welcomeMsgMoodem = (toastRef: any) => (data: any) => toastRef.show(data, 3000);

const P2PLanding = (props: any) => {
    const { group }: any = useContext(AppContext);
    const [isLoading, setIsloading] = useState(true);
    const isFocused = useIsFocused();
    const toastRef = useRef(null);
    const media = new AbstractMedia();

    useEffect(() => {
        console.log('2. ON P2PLanding');
        if (isFocused) {
            media.on('server-send-message-welcomeMsg', () => welcomeMsgMoodem(toastRef.current));
            media.emit('server-send-message-welcomeMsg', { chatRoom: group.group_name });
            setIsloading(false);
        }

        return () => {
            console.log('3. OFF P2PLanding');
            media.destroy();
        };
    }, []);

    if (isLoading) {
        return (
            <View>
                <BgImage />
                <PreLoader
                    containerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    size={50}
                />
            </View>
        );
    }

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={() => {
                    props.navigation.openDrawer();
                }}
                customStyle={{ top: -5, left: 0, width: 30, height: 30 }}
            />
            <Songs {...props} />
            <Toast
                position='top'
                ref={toastRef}
            />
        </BodyContainer>
    );
};

memo(P2PLanding);

export {
    P2PLanding
};
