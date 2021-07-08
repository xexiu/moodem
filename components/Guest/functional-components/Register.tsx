import React, { memo, useRef } from 'react';
import { View } from 'react-native';
import { btnStyleDefault } from '../../../src/css/styles/customButton';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import CustomButton from '../../common/functional-components/CustomButton';
import CustomModal from '../../common/functional-components/CustomModal';
import FormRegister from '../functional-components/FormRegister';

const Register = ({ initMoodem }: any) => {
    const modalRef = useRef() as any;

    function toggleModal() {
        return modalRef.current.setAllValues((prev: any) => {
            return {
                ...prev,
                isVisible: true,
                element: () => <FormRegister initMoodem={initMoodem} />
            };
        });
    }

    return (
        <View>
            <CustomButton
                btnTitle={translate('register.title')}
                btnStyle={[btnStyleDefault, { backgroundColor: '#00b7e0' }]}
                action={toggleModal}
            />

            <CustomModal
                ref={modalRef}
                onBackdropPress={() => modalRef.current.setAllValues((prev: any) => ({ ...prev, isVisible: false }))}
            />
        </View>
    );
};

export default memo(Register);
