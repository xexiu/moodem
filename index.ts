import React from 'react';

// if (process.env.NODE_ENV === 'development') {
//     const whyDidYouRender = require('@welldone-software/why-did-you-render');
//     whyDidYouRender(React, {
//         trackAllPureComponents: true
//     });
// }
if (__DEV__) {
    import('./src/js/Utils/common/reactotronConfig');
}
import { AppRegistry, Platform } from 'react-native';
import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import App from './App';

AppRegistry.registerComponent('moodem', () => gestureHandlerRootHOC(App));

if (Platform.OS === 'web') {
    const rootTag = document.getElementById('root') || document.getElementById('main');
    AppRegistry.runApplication('app', { rootTag });
}
