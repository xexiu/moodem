import { AppRegistry, Platform } from 'react-native';
import Moodem from './Moodem';

AppRegistry.registerComponent('moodem', () => Moodem);

if (Platform.OS === 'web') {
    const rootTag = document.getElementById('root') || document.getElementById('main');
    AppRegistry.runApplication('moodem', { rootTag });
}
