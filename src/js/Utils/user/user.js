import firebase from '../Helpers/services/firebase';

export function getUser() { // Not Working - check way
    return firebase.auth().onAuthStateChanged(user => user || null);
}

