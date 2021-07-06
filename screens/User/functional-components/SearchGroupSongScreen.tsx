import React, { memo, useContext, useEffect, useRef } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import { AppContext } from '../../../components/User/store-context/AppContext';
import { COMMON_NAVIGATION_OPTIONS } from '../../../src/js/Utils/constants/navigation';

const SearchGroupSongScreen = (props: any) => {
    const { navigation } = props;
    const { group }: any = useContext(AppContext);
    const toastRef = useRef() as any;

    useEffect(() => {
        navigation.setOptions({
            ...COMMON_NAVIGATION_OPTIONS,
            title: `Lista Canciones: ${group.group_name}`
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

export default memo(SearchGroupSongScreen);
