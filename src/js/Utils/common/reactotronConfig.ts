import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron, { asyncStorage, networking, storybook, trackGlobalErrors } from 'reactotron-react-native';

Reactotron
    .setAsyncStorageHandler(AsyncStorage)
    .configure({
        name: 'Moodem'
    })
    .use(trackGlobalErrors({
        veto: frame => frame.fileName.indexOf('renderItem') >= 0
    }))
    .useReactNative({
        storybook: true
    })
    .use(networking())
    .use(asyncStorage({ ignore: ['secret'] }))
    .useReactNative({
        asyncStorage: { ignore: ['secret'] }, // there are more options to the async storage.
        networking: { // optionally, you can turn it off with false.
            ignoreUrls: /symbolicate/
        },
        editor: false, // there are more options to editor
        errors: { veto: (stackFrame) => false }, // or turn it off with false
        overlay: false // just turning off overlay
    })
    .connect();
Reactotron.clear();
