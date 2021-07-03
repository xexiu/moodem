// if (process.env.NODE_ENV === 'development') {
//     const whyDidYouRender = require('@welldone-software/why-did-you-render');
//     whyDidYouRender(React, {
//         trackAllPureComponents: true
//     });
// }
if (__DEV__) {
    import('./src/js/Utils/common/reactotronConfig');
}
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import App from './App';

AppRegistry.registerComponent('moodem', () => App);
