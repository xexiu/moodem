import React, { memo } from 'react';
import { Text, View } from 'react-native';

export const GroupEmpty = memo(() => (
    <View style={{ alignItems: 'center', marginTop: 10, backgroundColor: 'transparent' }}>
        <Text>You dont have any group. Please create one!</Text>
    </View>
));
