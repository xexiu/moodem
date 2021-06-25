/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect } from 'react';
import { Text, View } from 'react-native';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import { COMMON_TEXT_STYLE as aboutTextStyle } from '../../../src/css/styles';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';

const AboutScreen = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
            title: translate('about.title'),
            headerMode: 'none',
            unmountOnBlur: true,
            unmountInactiveRoutes: true,
            headerBackTitleVisible: false
        });
        return () => {

        };
    }, [isFocused]);

    return (
        <BodyContainer useScrollView={true}>
            <View style={{ marginTop: 5, padding: 10 }}>
                <Text style={{ fontWeight: '600', alignSelf: 'center' }}>Moodem</Text>
                <Text style={aboutTextStyle}>{translate('about.text.0')}</Text>
                <Text style={aboutTextStyle}>{translate('about.text.1')}</Text>
                <Text style={aboutTextStyle}>{translate('about.text.2')}</Text>
                <Text style={aboutTextStyle}>{translate('about.text.3')}</Text>
                <Text style={aboutTextStyle}>{translate('about.text.4')}</Text>
                <Text style={aboutTextStyle}>{translate('about.text.5')}</Text>
                <Text style={aboutTextStyle}>{translate('about.text.6')}</Text>
            </View>
        </BodyContainer>
    );
};

export default memo(AboutScreen);
