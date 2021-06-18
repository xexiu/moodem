import React, { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import CustomButton from '../../../components/common/functional-components/CustomButton';

const ShowPopUpPasswordGroup = forwardRef((props: any, ref: any) => {
    const {
        item,
        handleChangeText,
        handleSubmit
    } = props;

    const [allValues, setAllValues] = useState({
        password: '',
        error: ''
    });

    useImperativeHandle(ref, () => {
        return {
            password: allValues.password,
            error: allValues.error,
            setAllValues
        };
    }, [allValues.password, allValues.error]);

    return (
        <View>
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#777',
                    textAlign: 'center',
                    margin: 10,
                    paddingTop: 25
                }}
            >El grupo {item.group_name} es privado!
            </Text>
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: '500' }}>Contraseña</Text>
            <TextInput
                style={{
                    height: 30,
                    borderColor: '#ddd',
                    borderBottomWidth: 0.5,
                    marginTop: 5,
                    marginBottom: 10,
                    borderRadius: 3
                }}
                onChangeText={handleChangeText}
                autoCorrect={false}
                autoCapitalize={'none'}
                placeholder={`Contraseña grupo: ${item.group_name}`}
                autoFocus
            />
            <CustomButton
                btnTitle='OK'
                btnDisabled={allValues.password !== item.group_password}
                action={handleSubmit}
            />
        </View>
    );
});

export default memo(ShowPopUpPasswordGroup);
