/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect } from 'react';
import { Text, View } from 'react-native';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import { COMMON_TEXT_STYLE as copyrightTextStyle } from '../../../src/css/styles';
import { getCurrentYear } from '../../../src/js/Utils/common/date';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';

const year = getCurrentYear();

const CopyrightScreen = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
            title: translate('copyright.title'),
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true
        });
        return () => {

        };
    }, [isFocused]);

    return (
        <BodyContainer useScrollView={true}>
            <View style={{ marginTop: 5, padding: 10 }}>
                <Text style={{ fontWeight: '600', alignSelf: 'center' }}>Copyright © {year} Moodem</Text>
                <Text style={{ fontWeight: '600', alignSelf: 'center' }}>{translate('copyright.copyright')}</Text>
                <Text style={copyrightTextStyle}>{translate('copyright.text.0')}</Text>
                <Text style={copyrightTextStyle}>{translate('copyright.text.1')}</Text>
                <Text style={copyrightTextStyle}>{translate('copyright.text.2')}</Text>
                <Text style={copyrightTextStyle}>{translate('copyright.text.3')}</Text>
                <Text style={copyrightTextStyle}>{translate('copyright.text.4')}</Text>
                <Text style={copyrightTextStyle}>{translate('copyright.text.5')}</Text>
                <Text style={copyrightTextStyle}>{translate('copyright.text.6')}</Text>
                <Text style={copyrightTextStyle}>{translate('copyright.text.7')}</Text>
                <Text style={copyrightTextStyle}>{translate('copyright.text.8')}</Text>
                <Text style={copyrightTextStyle}>{translate('copyright.text.9')}</Text>
            </View>
        </BodyContainer>
    );
};

export default memo(CopyrightScreen);
