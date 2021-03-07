import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';
import Reactotron from 'reactotron-react-native';

const storage = new Storage({
    // maximum capacity, default 1000 key-ids
    size: 10000,

    // Use AsyncStorage for RN apps, or window.localStorage for web apps.
    // If storageBackend is not set, data will be lost after reload.
    storageBackend: AsyncStorage, // for web: window.localStorage

    // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: 1000 * 3600 * 24,

    // cache data in the memory. default is true.
    enableCache: false,

    // if data was not found in storage or expired data was found,
    // the corresponding sync method will be invoked returning
    // the latest data.
    sync: {
        // we'll talk about the details later.
    }
});

console.log('All keys', AsyncStorage.getAllKeys().then(data => {
    console.log('Dataaa', data);
}));

export function removeItem(key: string, cb: any): Promise<void> {
    if (!key) {
        return Promise.reject('Please provide a valid key for removeItem AsyncStorage');
    }
    return AsyncStorage.removeItem(key, cb);
}

export function saveUserSearchedSongs(key: string, value: any, searchedText: string) {
    const saveNewUserSearchedSongs = {
        searchedSongs: {} as any
    };

    saveNewUserSearchedSongs.searchedSongs[searchedText] = value;

    storage.save(
        {
            key, // Note: Do not use underscore("_") in key!
            data: saveNewUserSearchedSongs,

        // if expires not specified, the defaultExpires will be applied instead.
        // if set to null, then it will never expire.
            expires: 1000 * 3600
        })
        .then(() => {
            console.log('Data saved in searchedsongs for user', key);
            return;
        });
}

export default storage;
