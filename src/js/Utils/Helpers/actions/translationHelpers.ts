import i18n from 'i18n-js';
import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance
import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';

export * as RNLocalize from 'react-native-localize';

export const locales = RNLocalize.getLocales();
export const currencies = RNLocalize.getCurrencies();
export const country = RNLocalize.getCountry();
export const calendarType = RNLocalize.getCalendar();
export const temperatureUnit = RNLocalize.getTemperatureUnit();
export const timeZone = RNLocalize.getTimeZone();

export const translationGetters = {
    // lazy requires (metro bundler does not support symlinks)
    es: () => require('../../../../translations/es.json') as any,
    en: () => require('../../../../translations/en.json') as any
} as any;

export const translate = memoize(
    (key: any, config: any) => i18n.t(key, config),
    (key: any, config: any) => (config ? key + JSON.stringify(config) : key)
) as any;

export const setI18nConfig = () => {
    // fallback if no available language fits
    const fallback = { languageTag: 'en', isRTL: false };

    const { languageTag, isRTL } =
        RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
        fallback;

    // clear translation cache
    translate.cache.clear();
    // update layout direction
    I18nManager.forceRTL(isRTL);
    // set i18n-js config
    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
};
