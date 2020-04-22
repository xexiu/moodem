import firebase from '../services/firebase';

export function registerHandler(validate) {
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(validate.email, validate.password)
            .then(auth => {
                console.log('Auth user', auth.user.uid);
                firebase.database().ref(`Users/${auth.user.uid}`).push({
                    name: validate.name,
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
