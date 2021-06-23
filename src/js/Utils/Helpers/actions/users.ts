import { USER_AVATAR_DEFAULT } from '../../constants/users';
import firebase from '../services/firebase';

const storage = firebase.storage();
const storageRefAllRandomUserAvatars = storage.ref('assets/images/random_user_avatars');

export async function resetPasswordHandler(validate: any) {
    try {
        return await firebase.auth().sendPasswordResetEmail(validate.email);
    } catch (error) {
        console.error('loginHandler Error', JSON.stringify(error));
        const errorCode = error.code;
        const errorMessage = error.message;
        console.warn(`Code: ${errorCode} and message: ${errorMessage}`);
    }
}

export async function loginHandler(validate: any) {
    try {
        return await firebase.auth().signInWithEmailAndPassword(validate.email, validate.password);
    } catch (error) {
        console.error('loginHandler Error', JSON.stringify(error));
        console.log('Validate Error', error);
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            console.warn('auth/wrong-password: ', `Code: ${errorCode} and message: ${errorMessage}`);
        } else if (errorCode === 'auth/network-request-failed') {
            console.warn('error network: ', `Code: ${errorCode} and message: ${errorMessage}`);
        }
        console.warn('error auth: ', `Code: ${errorCode} and message: ${errorMessage}`);
    }
}

export async function registerNewUser(data: any) {
    try {
        return await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
    } catch (error) {
        console.error('registerNewUser Error', JSON.stringify(error));
        const errorCode = error.code;
        const errorMessage = error.message;
        console.warn(`Code: ${errorCode} and message: ${errorMessage}`);
    }
}

export async function updateProfile(auth: any, data: any) {
    try {
        return await auth.user.updateProfile({
            displayName: data.name,
            photoURL: USER_AVATAR_DEFAULT
        });
    } catch (error) {
        console.error('updateProfile Error', JSON.stringify(error));
        console.warn(`Code: ${error}`);
    }
}

export async function saveNewUserOnDB(user: any, validate: any) {
    try {
        return await firebase.database().ref(`Users/${user.uid}`).set({
            user_id: user.uid,
            email: validate.email,
            password: validate.password,
            displayName: user.displayName,
            photoURL: user.photoURL
        });
    } catch (error) {
        console.error('saveNewUserOnDB Error', JSON.stringify(error));
        console.warn('error saving on DB ', error);
    }
}

export async function getAllRandomUserAvatars() {
    const data = await storageRefAllRandomUserAvatars.listAll();
    const urls: string[] = [];

    if (data.items) {
        try {
            for await (const item of data.items) {
                const url = await item.getDownloadURL();
                urls.push(url);
            }
        } catch (error) {
            console.error('getAllRandomUserAvatars Error', JSON.stringify(error));
        }
    }
    return urls;
}

export async function logOut() {
    try {
        await firebase.auth().signOut();
    } catch (error) {
        console.error('logOut Error', JSON.stringify(error));
    }
}
