import firebase from '../services/firebase';

export function resetPasswordHandler(validate) {
    return new Promise((resolve, reject) => {
        firebase.auth().sendPasswordResetEmail(validate.email)
            .then((data) => {
                console.warn('Password reset email sent');
                return resolve(data);
            }).catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.warn(`Code: ${errorCode} and message: ${errorMessage}`);
                reject(errorMessage);
            });
    });
}
