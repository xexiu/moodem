import React, { memo, useRef } from 'react';
import { View } from 'react-native';
import CustomButton from '../../../components/common/functional-components/CustomButton';
import CustomModal from '../../../components/common/functional-components/CustomModal';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import FormLogin from './FormLogin';

const Login = ({ initMoodem }: any) => {
    const modalRef = useRef() as any;

    function toggleModal() {
        return modalRef.current.setAllValues((prev: any) => {
            return {
                ...prev,
                isVisible: true,
                element: () => <FormLogin modalRef={modalRef.current} initMoodem={initMoodem} />
            };
        });
    }

    return (
        <View style={{ alignItems: 'center', padding: 5 }}>
            <CustomButton
                btnTitle={translate('login.title')}
                action={toggleModal}
            />
            <CustomModal
                ref={modalRef}
                onBackdropPress={() => modalRef.current.setAllValues((prev: any) => ({ ...prev, isVisible: false }))}
            />
        </View>
    );
};

export default memo(Login);
