import React, { memo, useContext, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import { Icon } from 'react-native-elements';
import CustomButton from '../../common/functional-components/CustomButton';
import { AppContext } from '../store-context/AppContext';

const FormUserEmail = () => {
    const { user } = useContext(AppContext) as any;
    const [allValues, setAllValues] = useState({
        userEmail: '',
        isLoading: false
    });
    const toastRef = useRef() as any;

    function resetValues() {
        return setAllValues((prev: any) => {
            return {
                ...prev,
                isLoading: false,
                userEmail: ''
            };
        });
    }

    async function handleUserEmail() {
        try {
            await user.updateEmail(allValues.userEmail);
            resetValues();
            toastRef.current.show('Actualizado!', 2000);
        } catch (error) {
            console.error('handleUserEmail Error', JSON.stringify(error));
            resetValues();
            toastRef.current.show(error.message, 2000);
        }
    }

    return (
        <View style={{ position: 'relative', flexDirection: 'row', marginBottom: 10 }}>
            <Toast
                position='top'
                ref={toastRef}
            />
            <TextInput
                style={{
                    borderWidth: 1,
                    fontStyle: 'italic',
                    padding: 5,
                    borderColor: '#eee',
                    borderRadius: 5,
                    width: '80%'
                }}
                underlineColorAndroid='transparent'
                placeholder='Cambiar Email'
                placeholderTextColor='#777'
                autoCapitalize='none'
                editable={!allValues.isLoading}
                value={allValues.userEmail}
                onChangeText={(text: string) => {
                    setAllValues((prev: any) => {
                        return {
                            ...prev,
                            isLoading: false,
                            userEmail: text
                        };
                    });
                }}
            />
            <CustomButton
                btnDisabled={allValues.isLoading}
                btnTitle=''
                btnIcon={
                    (
                        <Icon
                            iconStyle={{ backgroundColor: 'transparent' }}
                            name={'check'}
                            type='entypo'
                            color='white'
                            size={22}
                        />
                    )
                }
                btnStyle={{ width: 50, height: 30, padding: 0, marginLeft: 10 }}
                btnTitleStyle={{ fontSize: 15 }}
                action={handleUserEmail}
            />
        </View>
    );
};

export default memo(FormUserEmail);
