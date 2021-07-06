import { USER_AVATAR_DEFAULT } from '../../constants/users';
import { auth, database, storage } from '../services/firebase';

const storageRefAllRandomUserAvatars = storage().ref('assets/images/random_user_avatars');

export async function resetPasswordHandler(validate: any) {
    try {
        return await auth().sendPasswordResetEmail(validate.email);
    } catch (error) {
        console.error('loginHandler Error', error);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.warn(`Code: ${errorCode} and message: ${errorMessage}`);
    }
}

export async function loginHandler(validate: any) {
    try {
        return await auth().signInWithEmailAndPassword(validate.email, validate.password);
    } catch (error) {
        console.error('loginHandler Error', error);
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
        return await auth().createUserWithEmailAndPassword(data.email, data.password);
    } catch (error) {
        console.error('registerNewUser Error', error);
        if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
        }
        const errorCode = error.code;
        const errorMessage = error.message;
        console.warn(`Code: ${errorCode} and message: ${errorMessage}`);
    }
}

export async function updateProfile(_auth: any, data: any) {
    try {
        return await _auth.user.updateProfile({
            displayName: data.name,
            photoURL: USER_AVATAR_DEFAULT
        });
    } catch (error) {
        console.error('updateProfile Error', error);
        console.warn(`Code: ${error}`);
    }
}

export async function saveNewUserOnDB(user: any, validate: any) {
    try {
        return await database().ref(`Users/${user.uid}`).set({
            user_id: user.uid,
            email: validate.email,
            password: validate.password,
            displayName: user.displayName,
            photoURL: user.photoURL
        });
    } catch (error) {
        console.error('saveNewUserOnDB Error', error);
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
            console.error('getAllRandomUserAvatars Error', error);
        }
    }
    return urls;
}

export async function logOut() {
    try {
        await auth().signOut();
    } catch (error) {
        console.error('logOut Error', error);
    }
}
