import React, { memo } from 'react';
import { Text, View } from 'react-native';

type GroupEmptyProps = {
    msg?: string
};

export const GroupEmpty = memo(({ msg = '0 Grupos' }: GroupEmptyProps) => (
    <View style={{ alignItems: 'center', marginTop: 10, backgroundColor: 'transparent' }}>
        <Text>{msg}</Text>
    </View>
));
