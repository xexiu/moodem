/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import { AbstractMedia } from '../common/functional-components/AbstractMedia';
import BgImage from '../common/functional-components/BgImage';
import BodyContainer from '../common/functional-components/BodyContainer';
import PreLoader from '../common/functional-components/PreLoader';
import { AppContext } from './functional-components/AppContext';
import Songs from './functional-components/Songs';

const MediaItems = (props: any) => {
    const { navigation } = props;
    const { group }: any = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();
    const media = new AbstractMedia();

    useEffect(() => {
        console.log('2. ON MediaItems');

        if (isFocused) {
            media.on('server-send-message-welcomeMsg', (data: any) => {
                media.toastRef.current.show(data.welcomeMsg, 3000);
            });
            media.emit('server-send-message-welcomeMsg', { chatRoom: group.group_name });
            setIsLoading(false);
        }

        return () => {
            console.log('3. OFF MediaItems');
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
            <Toast
                position='top'
                ref={media.toastRef}
            />
            <Songs media={media} navigation={navigation} />
        </BodyContainer>
    );
};

export default memo(MediaItems);
