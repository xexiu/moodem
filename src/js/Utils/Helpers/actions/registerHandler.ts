import { USER_AVATAR_DEFAULT } from '../../constants/users';
import firebase from '../services/firebase';

function registerNewUser(validate: any) {
    return new Promise<void>((resolve: Function, reject: Function) => {
        firebase.auth().createUserWithEmailAndPassword(validate.email, validate.password)
            .then((auth: any) => {
                console.log('User successfully registered!', auth);
                resolve(auth);
            })
            .catch((error: any) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.warn(`Code: ${errorCode} and message: ${errorMessage}`);

                return reject(errorMessage);
            });
    });
}

function updateProfile(auth: any, validate: any) {
    return new Promise<void>((resolve: Function, reject: Function) => auth.user.updateProfile({
        displayName: validate.name,
        photoURL: USER_AVATAR_DEFAULT
    })
        .then(() => resolve(auth))
        .catch((error: any) => reject('User Profile Update Failed, error: ', error)));
}

function saveNewUserOnDB(auth: any, validate: any) {
    return new Promise<void>((resolve: Function, reject: Function) => firebase.database().ref(`Users/${auth.user.uid}`).set({
        user_id: auth.user.uid,
        email: validate.email,
        password: validate.password
    }).then(() => {
        console.log('Saved on DB ');

        return resolve(auth);
    }).catch((error: any) => {
        console.log('error saving on DB ', error);

        return reject(error);
    }));
}

export function registerHandler(validate: any) {
    return new Promise<void>((resolve: Function, reject: Function) => registerNewUser(validate)
        .then(auth => updateProfile(auth, validate))
        .then(auth => saveNewUserOnDB(auth, validate))
        .then(auth => resolve(auth))
        .catch(error => reject(error)));
}
