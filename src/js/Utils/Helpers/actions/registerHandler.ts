import { USER_AVATAR_DEFAULT } from '../../constants/users';
import firebase from '../services/firebase';

export function registerNewUser(data: any) {
    return firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        .then((user: any) => user)
        .catch((error: any) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.warn(`Code: ${errorCode} and message: ${errorMessage}`);
            return error;
        });
}

export function updateProfile(auth: any, data: any) {
    return auth.user.updateProfile({
        displayName: data.name,
        photoURL: USER_AVATAR_DEFAULT
    })
        .then(() => auth.user)
        .catch((error: any) => console.warn(`Code: ${error}`));
}

export function saveNewUserOnDB(auth: any, validate: any) {
    return firebase.database().ref(`Users/${auth.user.uid}`).set({
        user_id: auth.user.uid,
        email: validate.email,
        password: validate.password
    }).catch((error: any) => {
        console.warn('error saving on DB ', error);
    });
}
