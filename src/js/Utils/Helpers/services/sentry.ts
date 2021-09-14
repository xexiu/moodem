import { SENTRY_KEY } from '@env';
import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/react-native';
const routingInstrumentation = new Sentry.ReactNavigationV5Instrumentation();

export const sentryInit = () => Sentry.init({
    dsn: SENTRY_KEY,
    debug: __DEV__ ? false : false,
    integrations: [
        new CaptureConsole({
            levels: ['error', 'warn']
        }),
        new Sentry.ReactNativeTracing({
            tracingOrigins: ['localhost', 'my-site-url.com', /^\//],
            routingInstrumentation
      // ... other options
        })
    ],
    tracesSampleRate: 0.1,
    attachStacktrace: true
});
