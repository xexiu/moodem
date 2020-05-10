/* eslint-disable max-len */
import React, { memo } from 'react';
import { View, Text } from 'react-native';

export const HeaderChat = memo(({ headerTitle, usersConnected }) => (
    <View style={{ marginTop: 35, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 }}>
        <Text>{headerTitle}</Text>
        <Text style={{ fontSize: 12, paddingTop: 2, fontStyle: 'italic', color: '#777' }}>{usersConnected} connected</Text>
    </View>
));
