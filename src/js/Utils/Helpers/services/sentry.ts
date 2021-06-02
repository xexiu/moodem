import { SENTRY_KEY } from '@env';
import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/react-native';

export const sentryInit = () => Sentry.init({
    dsn: SENTRY_KEY,
    debug: __DEV__ ? false : false,
    integrations: [
        new CaptureConsole({
            levels: ['error']
        })
    ],
    attachStacktrace: true
});
