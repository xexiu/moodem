import { AsyncStorage } from 'react-native';

export function errorHandler(msg) {
    return function(err) {
        return new Error(msg, err);
    }
}