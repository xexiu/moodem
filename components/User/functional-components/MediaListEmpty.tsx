import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';

type MediaProps = {
    msg?: string
};

export const MediaListEmpty = memo(({ msg = translate('mediaList.empty') }: MediaProps) => (
    <View style={{ alignItems: 'center', marginTop: 10, backgroundColor: 'transparent' }}>
        <Text>{msg}</Text>
    </View>
));
