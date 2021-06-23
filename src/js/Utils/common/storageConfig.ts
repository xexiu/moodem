import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';

const ONE_DAY = 1000 * 3600 * 24;
const NINTY_DAYS = ONE_DAY * 90;
const FIVE_HOURS = ONE_DAY - 19;
const TEN_THOUSANDS = 10000;

const storage = new Storage({
    // maximum capacity, default 1000 key-ids
    size: TEN_THOUSANDS,

    // Use AsyncStorage for RN apps, or window.localStorage for web apps.
    // If storageBackend is not set, data will be lost after reload.
    storageBackend: AsyncStorage, // for web: window.localStorage

    // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: NINTY_DAYS,

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
            return null;
        case 'ExpiredError':
                // TODO
            return null;
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

export async function saveOnLocalStorage(key: string, value: any, expires: number = FIVE_HOURS): Promise<void> {
    await storage.save(
        {
            key,
            data: value,
            expires
        });
    return;
}

export default storage;
