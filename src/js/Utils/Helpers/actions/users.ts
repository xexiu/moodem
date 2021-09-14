import { USER_AVATAR_DEFAULT } from '../../constants/users';
import { auth, database, storage } from '../services/firebase';

const storageRefAllRandomUserAvatars = storage().ref('assets/images/random_user_avatars');

export async function updateProfile(_auth: any, data: any) {
    try {
        return await _auth.user.updateProfile({
            displayName: data.name,
            photoURL: USER_AVATAR_DEFAULT
        });
    } catch (error) {
        console.warn('updateProfile Error', error);
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
        console.warn('saveNewUserOnDB Error', error);
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
            console.warn('getAllRandomUserAvatars Error', error);
        }
    }
    return urls;
}

export async function logOut() {
    try {
        await auth().signOut();
    } catch (error) {
        console.warn('logOut Error', error);
    }
}
