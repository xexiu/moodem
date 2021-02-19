import * as Sentry from '@sentry/react-native';
import { SENTRY_KEY } from '../../constants/Api/apiKeys';

export default Sentry.init({
    dsn: SENTRY_KEY,
});
