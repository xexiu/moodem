import firebase from '../services/firebase';
import { USER_AVATAR_DEFAULT } from '../../constants/users';

export function registerHandler(validate) {
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(validate.email, validate.password)
            .then(auth => {
                console.log('Auth user', auth.user);
                auth.user.updateProfile({
                    displayName: validate.name,
                    photoURL: USER_AVATAR_DEFAULT
                }).then(() => {
                    // Update successful.
                }).catch((error) => {
                    // An error happened.
                });
                firebase.database().ref(`Users/${auth.user.uid}`).set({
                    user_id: auth.user.uid,
                    email: validate.email,
                    password: validate.password
                }).then((data) => {
                    //success callback
                    console.log('Saved on database ', data);

                    return resolve(data);
                    // eslint-disable-next-line newline-per-chained-call
                }).catch((error) => {
                    //error callback
                    console.log('error ', error);

                    return reject(error);
                });
                console.log('User successfully registered!', auth);

                return resolve(auth);
            }).catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.warn(`Code: ${errorCode} and message: ${errorMessage}`);

                return reject(errorMessage);
            });
    });
}
