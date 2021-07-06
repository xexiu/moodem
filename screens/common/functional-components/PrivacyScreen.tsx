/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect } from 'react';
import { Text, View } from 'react-native';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import { COMMON_TEXT_STYLE as privacyTextStyle } from '../../../src/css/styles';
import { COMMON_NAVIGATION_OPTIONS } from '../../../src/js/Utils/constants/navigation';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';

const PrivacyScreen = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
            ...COMMON_NAVIGATION_OPTIONS,
            title: translate('privacy.title')
        });
        return () => {

        };
    }, [isFocused]);
    return (
        <BodyContainer useScrollView={true}>
            <View style={{ marginTop: 5, padding: 10 }}>
                <Text style={privacyTextStyle}>{translate('privacy.text.0')}</Text>
                <Text style={{ fontWeight: '600', alignSelf: 'center' }}>{translate('privacy.subtitles.0')}</Text>
                <Text style={privacyTextStyle}>{translate('privacy.text.1')}</Text>
                <Text style={{ fontWeight: '600', alignSelf: 'center' }}>{translate('privacy.subtitles.1')}</Text>
                <Text style={privacyTextStyle}>{translate('privacy.text.2')}</Text>
                <Text style={{ fontWeight: '600', alignSelf: 'center' }}>{translate('privacy.subtitles.2')}</Text>
                <Text style={privacyTextStyle}>{translate('privacy.text.3')}</Text>
                <Text>{translate('privacy.text.4')}</Text>
            </View>
        </BodyContainer>
    );
};

export default memo(PrivacyScreen);
