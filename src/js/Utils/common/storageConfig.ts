import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';

const ONE_DAY = 1000 * 3600 * 24;
const FIVE_HOURS = ONE_DAY - 19;
const THIRTY_DAYS = ONE_DAY + 30;
const TEN_THOUSANDS = 1000;

const storage = new Storage({
    // maximum capacity, default 1000 key-ids
    size: TEN_THOUSANDS,

    // Use AsyncStorage for RN apps, or window.localStorage for web apps.
    // If storageBackend is not set, data will be lost after reload.
    storageBackend: AsyncStorage, // for web: window.localStorage

    // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: ONE_DAY,

    // cache data in the memory. default is true.
    enableCache: true,

    // if data was not found in storage or expired data was found,
    // the corresponding sync method will be invoked returning
    // the latest data.
    sync: {
        // we'll talk about the details later.
    }
});

// console.log('All keys', AsyncStorage.getAllKeys().then(data => {
//     console.log('Dataaa', data);
// }));

export async function getItemFromLocalStorage(key: string) {
    const _key = await AsyncStorage.getItem(key);
    return _key;
}

export async function loadFromLocalStorage(key: string) {
    try {
        return await storage.load({ key });
    } catch (err) {
        // any exception including data not found
        // goes to catch()
        console.warn(err.message);
        switch (err.name) {
        case 'NotFoundError':
                // TODO;
            return err.name;
        case 'ExpiredError':
                // TODO
            return err.name;
        }
    }
}

export function clearMap() {
    return storage.clearMap();
}

export async function removeItem(key: string, cb?: any): Promise<void> {
    if (!key) {
        return Promise.reject('Please provide a valid key for removeItem AsyncStorage');
    }
    return AsyncStorage.removeItem(key, cb);
}

export async function saveOnLocalStorage(key: string, value: any): Promise<void> {
    await storage.save(
        {
            key,
            data: value,
            expires: FIVE_HOURS
        });
    return;
}

// export function saveUserSearchedSongs(key: string, value: any, searchedText: string) {
//     const saveNewUserSearchedSongs = {
//         searchedSongs: {} as any
//     };

//     saveNewUserSearchedSongs.searchedSongs[searchedText] = value;

//     storage.save(
//         {
//             key, // Note: Do not use underscore("_") in key!
//             data: saveNewUserSearchedSongs,
//             expires: THIRTY_DAYS
//         })
//         .then((data) => {
//             console.log('Data saved in searchedsongs for user', key, 'Data', data);
//             return;
//         });
// }

export default storage;
