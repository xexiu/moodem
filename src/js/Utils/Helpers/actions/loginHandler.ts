/* eslint-disable max-len */
/* eslint-disable no-console */
import firebase from '../services/firebase';

export function loginHandler(validate) {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(validate.email, validate.password)
			.then((user) => resolve(user)).catch(error => {
    console.log('Validate Error', error);
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode === 'auth/wrong-password') {
					console.warn('auth/wrong-password: ', `Code: ${errorCode} and message: ${errorMessage}`);
					reject({
						code: errorCode,
						message: errorMessage
					});
				} else if (errorCode === 'auth/network-request-failed') {
					console.warn('error network: ', `Code: ${errorCode} and message: ${errorMessage}`);
					reject({
						code: errorCode,
						message: errorMessage
					});
				}
    console.warn('error auth: ', `Code: ${errorCode} and message: ${errorMessage}`);
    reject({
					code: errorCode,
					message: errorMessage
				});
});
    });
}
