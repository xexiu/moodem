import React, { memo, useContext, useEffect, useRef } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import { AppContext } from '../../../components/User/store-context/AppContext';

const SearchGroupSongScreen = (props: any) => {
    const { navigation } = props;
    const { group }: any = useContext(AppContext);
    const toastRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
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
