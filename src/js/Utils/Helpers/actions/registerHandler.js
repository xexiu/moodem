import firebase from '../services/firebase';
import { USER_AVATAR_DEFAULT } from '../../constants/users';

function registerNewUser(validate) {
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(validate.email, validate.password)
            .then(auth => {
                console.log('User successfully registered!', auth);
                resolve(auth);
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.warn(`Code: ${errorCode} and message: ${errorMessage}`);

                return reject(errorMessage);
            });
    });
}

function updateProfile(auth, validate) {
    return new Promise((resolve, reject) => auth.user.updateProfile({
        displayName: validate.name,
        photoURL: USER_AVATAR_DEFAULT
    })
        .then(() => resolve(auth))
        .catch((error) => reject('User Profile Update Failed, error: ', error)));
}

function saveNewUserOnDB(auth, validate) {
    return new Promise((resolve, reject) => firebase.database().ref(`Users/${auth.user.uid}`).set({
        user_id: auth.user.uid,
        email: validate.email,
        password: validate.password
    }).then(() => {
        console.log('Saved on DB ');

        return resolve(auth);
        // eslint-disable-next-line newline-per-chained-call
    }).catch((error) => {
        //error callback
        console.log('error saving on DB ', error);

        return reject(error);
    }));
}

export function registerHandler(validate) {
    return new Promise((resolve, reject) => registerNewUser(validate)
        .then(auth => updateProfile(auth, validate))
        .then(auth => saveNewUserOnDB(auth, validate))
        .then(auth => resolve(auth))
        .catch(error => reject(error)));
}
