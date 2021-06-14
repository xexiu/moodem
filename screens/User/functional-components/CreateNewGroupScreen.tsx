import React, { memo, useEffect, useRef } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';

const CreateNewGroupScreen = (props: any) => {
    const { navigation } = props;
    const toastRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            title: 'Crear un nuevo grupo'
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

export default memo(CreateNewGroupScreen);
