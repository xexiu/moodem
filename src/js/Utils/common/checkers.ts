import { find, get, keys } from 'lodash';
export { differenceWith, isEqual } from 'lodash';

type anyObject = (any | any);

export function isEmpty(x: object) {
    return !x || (x.constructor !== Number && Object.keys(x).length === 0);
}

export function hasObjWithProp(obj: anyObject, prop: string, objToSearch: object) {
    return find(obj[prop], objToSearch);
}

export function isNothing(obj: object) {
    return typeof obj === 'undefined' || obj === null;
}

export function getKeyNumber(obj: object, number = 0 as number) {
    return get(keys(obj), number);
}

export function checkIfValidPromise(song: any, songConverted: any) {
    if (song.status !== 'rejected' && Object.keys(song.value).length) {
        songConverted.push(song.value);
        return true;
    }
    return false;
}

export function checkIfAlreadyOnList(songs: string[], searchedSongs: string[]) {
    songs.filter((song: any) => {
        return !searchedSongs.some((searchedSong: any) => {
            if (song.id === searchedSong.id && song.isMediaOnList) {
                Object.assign(searchedSong, {
                    isMediaOnList: true
                });
            }
        });
    });
}
