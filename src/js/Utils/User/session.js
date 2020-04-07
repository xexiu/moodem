import AsyncStorage from '@react-native-community/async-storage';

export function clearStorage(callback = () => {}) {
    AsyncStorage.clear()
    .then(callback)
    .catch(err => {
        throw new Error('Failed to clearStorage()', err.message);
    });
}

export function setStorage(itemName, objToStore, callback) {
    AsyncStorage.setItem(
        itemName,
        JSON.stringify(objToStore))
        .then(callback)
        .catch(err => {
            throw new Error('There was a problem storing the object, in setStorage()', err.message);
        });
}

export function getFromStorage(spotifyAuth) {
    return AsyncStorage.getItem(spotifyAuth);
}