/* eslint-disable max-len */
import React from 'react';
import { Text, View } from 'react-native';
import { CustomButton } from '../../common/functional-components/CustomButton';

export const Copyright = (props) => {
    const {
        navigation
    } = props;

    return (
        <View style={{ alignSelf: 'flex-start', position: 'absolute' }}>
            <CustomButton
                btnViewComponent={() => <Text style={{ color: '#dd0031', marginTop: 5 }}>© <Text style={{ color: '#dd0031' }}>Mood</Text><Text style={{ color: '#222' }}>em</Text></Text>}
                btnTitleStyle={{ fontSize: 14 }}
                btnStyle={{ backgroundColor: 'red', paddingLeft: 0, width: 30 }}
                btnRaised={false}
                shadow={{}}
                action={() => navigation.navigate('Copyright')}
            />
        </View>
    );
};
