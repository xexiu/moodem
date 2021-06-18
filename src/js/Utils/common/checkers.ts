import { find, get, keys } from 'lodash';

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
