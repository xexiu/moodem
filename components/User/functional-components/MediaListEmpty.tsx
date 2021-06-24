import React, { memo } from 'react';
import { Text, View } from 'react-native';

type MediaProps = {
    msg?: string
};

export const MediaListEmpty = memo(({ msg = 'La lista está vacia!' }: MediaProps) => (
    <View style={{ alignItems: 'center', marginTop: 10, backgroundColor: 'transparent' }}>
        <Text>La lista está vacia!</Text>
    </View>
));
