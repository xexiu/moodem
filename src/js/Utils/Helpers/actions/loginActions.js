import firebase from '../../Helpers/firebase';

/*eslint-disable no-console */

export function login() {
	const validate = this.refForm.current.getValue();

	if (validate) {
		firebase.auth().signInWithEmailAndPassword(validate.email, validate.password)
			.then((user) => {
				console.log('Welcome back: ', user);
			}).catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;

				if (errorCode === 'auth/wrong-password') {
					console.log('auth/wrong-password: ', errorCode);
				} else {
					console.log('error: ', errorMessage);
				}
			});
	}
}
