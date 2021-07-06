/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect } from 'react';
import { Text, View } from 'react-native';
import { BodyContainer } from '../../../components/common/functional-components/BodyContainer';
import { COMMON_TEXT_STYLE as faqTextStyle } from '../../../src/css/styles';
import { COMMON_NAVIGATION_OPTIONS } from '../../../src/js/Utils/constants/navigation';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';

const FAQScreen = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions(COMMON_NAVIGATION_OPTIONS);
        return () => {

        };
    }, [isFocused]);

    return (
        <BodyContainer>
            <View style={{ marginTop: 5, padding: 10 }}>
                <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>{translate('faq.questions.0')}</Text>
                <Text style={faqTextStyle}>{translate('faq.text.0')}</Text>
                <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>{translate('faq.questions.1')}</Text>
                <Text style={faqTextStyle}>{translate('faq.text.1')}</Text>
                <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>{translate('faq.questions.2')}</Text>
                <Text style={faqTextStyle}>{translate('faq.text.2')}</Text>
                <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>{translate('faq.questions.3')}</Text>
                <Text style={faqTextStyle}>{translate('faq.text.3')}</Text>
                <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>{translate('faq.questions.4')}</Text>
                <Text style={faqTextStyle}>{translate('faq.text.4')}</Text>
                <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>{translate('faq.questions.5')}</Text>
                <Text style={faqTextStyle}>{translate('faq.text.5')}</Text>
            </View>
        </BodyContainer>
    );
};

export default memo(FAQScreen);
